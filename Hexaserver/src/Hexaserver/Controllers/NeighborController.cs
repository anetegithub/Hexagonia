using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Data;
using Hexaserver.Models;
using Hexaserver.Extensions;
using Hexaserver.Repository;
using Newtonsoft.Json;
using System.Dynamic;
using Microsoft.AspNet.Authorization;
using Hexaserver.Security;

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class NeighborController : Controller
    {
        private readonly IPlayerRepository _Repository;

        private object AuthError;
        private bool Identify()
        {
            var IdentifyState = Auth.Identify(Context);
            if (IdentifyState.Access)
                return true;
            else if (IdentifyState.Role == Role.During)
                AuthError = new { Token = IdentifyState.Short, Id = IdentifyState.Player };
            else
                AuthError = "401";

            return false;
        }

        public NeighborController(IPlayerRepository Repository)
        {
            _Repository = Repository;
        }

        [HttpPost]
        public Object DropIn([FromBody]Friend Item)
        {
            if (!Identify())
                return AuthError;

            if (!ModelState.IsValid)
                return "400";

            if (string.IsNullOrEmpty(Item.Login))
                return "402";

            Player UnsecurityFriend = _Repository.GetByLogin(Item.Login);
            Player SecurityFriend = new Player();
            SecurityFriend.Login = Item.Login;
            SecurityFriend.Avatar = UnsecurityFriend?.Avatar;
            SecurityFriend.Field = UnsecurityFriend?.Field;            
            //SecurityFriend.Map = UnsecurityFriend?.Map;

            if (SecurityFriend.Field != null)
                return SecurityFriend;
            else
                return "404";
        }
    }
}