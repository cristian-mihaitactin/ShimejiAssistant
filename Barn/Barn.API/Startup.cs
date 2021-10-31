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

            // --------------------------------- EF ---------------------------------//

            // We are adding the DI services - We setup a Db Context
            services.AddDbContext<ApplicationDbContext>(options =>
                // Adding configuration to use Sqlite with our application
                options.UseSqlite( // adding the connection string path to our db
                        Configuration.GetConnectionString("DefaultConnection")));


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

            app.UseHttpsRedirection();

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

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
