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
    public class AccountController : Controller
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
                AuthError = IdentifyState.ToJson();//"401";

            return false;
        }

        public AccountController(IPlayerRepository Repository)
        {
            _Repository = Repository;
        }

        [HttpPost]
        public Object TestConnection([FromBody]Player Item)
        {
            if (!Identify())
                return AuthError;
            else
                return "true";
        }

        [HttpPost]
        public Object CreateUser([FromBody]Player Item)
        {
            if (!Identify())
                return AuthError;

            if (!ModelState.IsValid)
                return HttpBadRequest();

            _Repository.Add(Item);

            return true;
        }

        [HttpPost]
        public Object Enter([FromBody]Player Item)
        {
            if (!Identify())
                return AuthError;

            if (!ModelState.IsValid)
                return "400";

            if (Item.PlayerId <= 0)
                return "402";

            return _Repository.GetById(Item.PlayerId);
        }
    }
}