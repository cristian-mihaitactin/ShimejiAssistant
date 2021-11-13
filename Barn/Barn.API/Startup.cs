using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Data.EF;
using Barn.Data.Mock;
using Barn.Entities;
using Barn.Services.Interfaces;
using Barn.Services.User;
using Barn.Services.UserPreferences;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

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
            services.AddControllers();

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen();

            // --------------------------------- Services ---------------------------------//
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserPreferencesService, UserPreferencesService>();


            // --------------------------------- OpenId ---------------------------------//
            services.AddOpenIddict()

            // Register the OpenIddict core components.
            .AddCore(options =>
            {
                // Configure OpenIddict to use the Entity Framework Core stores and models.
                // Note: call ReplaceDefaultEntities() to replace the default entities.
                options.UseEntityFrameworkCore()
                       .UseDbContext<ApplicationDbContext>()
                               .ReplaceDefaultEntities<Guid>();
            })

            // Register the OpenIddict server components.
            .AddServer(options =>
            {
                // Enable the token endpoint.
                options.SetTokenEndpointUris("/connect/token");

                // Enable the client credentials flow.
                options.AllowClientCredentialsFlow();

                // Register the signing and encryption credentials.
                options.AddDevelopmentEncryptionCertificate()
                      .AddDevelopmentSigningCertificate();

                // Register the ASP.NET Core host and configure the ASP.NET Core options.
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
            // Note: in a real world application, this step should be part of a setup script.
            services.AddHostedService<Worker>();

            // --------------------------------- EF ---------------------------------//
            // We are adding the DI services - We setup a Db Context
            services.AddDbContext<ApplicationDbContext>(options =>
            {

                // Adding configuration to use Sqlite with our application
                options.UseSqlServer( // adding the connection string path to our db
                        Configuration.GetConnectionString("DefaultConnection"));
                // Register the entity sets needed by OpenIddict.
                // Note: use the generic overload if you need
                // to replace the default OpenIddict entities.
                options.UseOpenIddict<Guid>();
            });

            services.AddSingleton<IGenericRepo<Guid, User>, UserRepo>();
            services.AddSingleton<IGenericRepo<Guid, UserPreferences>, UserPreferencesRepo>();
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
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
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
