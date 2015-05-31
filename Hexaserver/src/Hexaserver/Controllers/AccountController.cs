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
using Hexaserver.Extensions;
using Microsoft.AspNet.Authorization;
using Hexaserver.Security;

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly IRepository _Repository;

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

        public AccountController(IRepository Repository)
        {
            _Repository = Repository;
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
        public Object TestConnection([FromBody]Player Item)
        {
            if (!Identify())
                return AuthError;
            else
                return "true";
        }
    }
}