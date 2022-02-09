
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Barn.API.Mapper;
using Barn.Data.EF;
using Barn.Data.EF.Repoes;
using Barn.Data.Mock;
using Barn.Entities;
using Barn.Entities.Plugins;
using Barn.Entities.Users;
using Barn.Services.BuckyProfile;
using Barn.Services.Interfaces;
using Barn.Services.Plugins;
using Barn.Services.User;
using Barn.Services.UserPreferences;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace Barn.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // services.AddCors();
            services.AddControllers();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = Configuration["Authorization:Issuer"];
                    options.Audience = Configuration["Authorization:Audience"];
                });
            services.AddAuthorization();

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen();

            // --------------------------------- Services ---------------------------------//
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserPreferencesService, UserPreferencesService>();
            services.AddScoped<IBuckyProfileService, BuckyProfileService>();
            services.AddScoped<IPluginService, PluginService>();
            services.AddSingleton<IConfiguration>(Configuration);


            // --------------------------------- OpenId ---------------------------------//
            // Register the Identity services.
            services.AddIdentity<User, IdentityRole<Guid>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.RoleClaimType = Claims.Role;
                options.ClaimsIdentity.UserNameClaimType = Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = Claims.Subject;
            });

            services.AddOpenIddict()
                // Register the OpenIddict core components.
                .AddCore(options =>
                 {
                     // Configure OpenIddict to use the Entity Framework Core stores and models.
                     options.UseEntityFrameworkCore()
                            .UseDbContext<ApplicationDbContext>()
                            .ReplaceDefaultEntities<Guid>();
                 })

                // Register the OpenIddict server components.
                .AddServer(options =>
                {
                    // Enable the token endpoint.
                    options.SetTokenEndpointUris("/connect/token");

                    // Enable the password and the refresh token flows.
                    options.AllowPasswordFlow()
                           .AllowRefreshTokenFlow();

                    // Accept anonymous clients (i.e clients that don't send a client_id).
                    options.AcceptAnonymousClients();

                    // Register the signing and encryption credentials.
                    options.AddDevelopmentEncryptionCertificate()
                           .AddDevelopmentSigningCertificate();

                    // Register the ASP.NET Core host and configure the ASP.NET Core-specific options.
                    options.UseAspNetCore()
                           .EnableTokenEndpointPassthrough();
                })

                // Register the OpenIddict validation components.
                .AddValidation(options =>
                {
                    // Import the configuration from the local OpenIddict server instance.
                    options.UseLocalServer();

                    // Register the ASP.NET Core host.
                    options.UseAspNetCore();
                });


            // Register the worker responsible of seeding the database with the sample clients.
            services.AddHostedService<Worker>();

            // --------------------------------- EF ---------------------------------//
            services.AddDbContext<ApplicationDbContext>(options =>
            {

                options.UseSqlServer(
                        Configuration.GetConnectionString("DefaultConnection"));
                options.UseOpenIddict<Guid>();
            });

            services.AddScoped<IGenericRepo<Guid, User>, UserRepo>();
            services.AddScoped<IGenericRepo<Guid, UserPreferences>, UserPreferencesRepo>();
            services.AddScoped<IGenericRepo<Guid, Entities.Bucky.BuckyProfile>, BuckyProfileRepo>();
            services.AddScoped<IGenericRepo<Guid, Entities.Plugins.Plugin>, PluginRepo>();
            services.AddScoped<IGenericRepo<Guid, Entities.Plugins.PluginNotification>, PluginNotificationRepo>();
            services.AddScoped<IGenericRepo<Tuple<Guid, Guid>, UserPreferencesPlugins>, UserPreferencesPluginsRepo>();

            // Auto Mapper Configurations
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Barn API V1");
                c.RoutePrefix = string.Empty;

            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
