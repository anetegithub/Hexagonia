using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Data;
using Newtonsoft.Json;
using Microsoft.Data.Entity;
using Hexaserver.Extensions;

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TestController : Controller
    {
        [HttpGet]
        public IActionResult AddToBaseWithoutFriends()
        {
            using (var db = new AccountContext())
            {
                //var NewPlayer = new Models.Player()
                //{
                //    Login = "Admin",
                //    Password = "555033",
                //    AuthCode = Guid.NewGuid().ToString()
                //};
                //var NewField = new Models.Field() { X = 5, Y = 8 };
                //NewPlayer.Field = NewField;
                //db.Players.Add(NewPlayer);
                //db.SaveChanges();

                //var NewPlayer = new Models.Player()
                //{
                //    Login = "Admin",
                //    Password = "555033",
                //    AuthCode = Guid.NewGuid().ToString()
                //};
                //var NewField = new Models.Field() { X = 5, Y = 8 };
                //NewPlayer.Field = NewField;
                //db.Players.Add(NewPlayer);
                //db.Fields.Add(NewField);
                //db.SaveChanges();


                var player = db.Players.Where(x => x.PlayerId == 35).Include(x => x.Field).First();

                //List<Object> Objl = new List<object>();
                //foreach(var o in db.Players.ToList())
                //{
                //    Objl.Add(JsonConvert.SerializeObject(o, Formatting.None,
                //        new JsonSerializerSettings()
                //        {
                //            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                //        }));
                //}

                //return Objl;

                //var player = db.Players.Where(x => x.PlayerId == 16).First();
                //var player = db.Fields.Where(x => x.PlayerId == 16).First().Player;
                
                return new ObjectResult(player.ToJson());
            }

            //return new { };
        }

        [HttpGet]
        public Object PlayerWithFieldById(String Id)
        {
            Int32 PlayerId = 0;
            if (!Int32.TryParse(Id, out PlayerId))
                return HttpBadRequest();
            using (var db = new AccountContext())
            {
                return db.Players.Where(x => x.PlayerId == PlayerId).Include(x => x.Field).First();
            }
        }

        [HttpGet]
        public Object SQLInjection(string Injection)
        {
            Boolean Cleared = false;
            String Message = "Done";
            try
            {
                using (var db = new AccountContext())
                {
                    db.Database.AsRelational().ExecuteSqlCommand(Injection);
                }
                Cleared = true;
            }
            catch (Exception ex)
            {
                Message = ex.Message;
            }

            return new { Result = Cleared, Message = Message };
        }

        [HttpGet]
        public IActionResult echo()
        {
            return new ObjectResult(new { Operation = "Ok" });
        }
    }
}
