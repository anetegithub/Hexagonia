using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Data;

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TestController : Controller
    {
        [HttpGet]
        public Object AddToBaseWithoutFriends()
        {
            using (var db = new TemplateContext())
            {
                db.Players.Add(new Models.Player()
                {
                    Login = "Admin",
                    Password = "555033",
                    AuthCode = Guid.NewGuid().ToString(),
                    Field = new Models.Field()
                    {
                        X = 5,
                        Y = 8
                    }
                });
                db.SaveChanges();
            }

            return new { };
        }
    }
}
