using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using Hexaserver.Models;
using Microsoft.AspNet.Http;
using Microsoft.Framework.ConfigurationModel;

namespace Hexaserver
{
    public class Startup
    {
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSingleton<ITodoRepository, TodoRepository>();
            services.AddEntityFramework().AddSqlServer();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseMvc();

            //pt2
            //app.UseWelcomePage();

            //pt 1
            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Am i broke roslyn? Nope! ^_^");
            });
        }
    }
}
