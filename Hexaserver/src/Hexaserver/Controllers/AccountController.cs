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
using Ext = Hexaserver.Extensions.ObjectExtensions;
using Microsoft.AspNet.Authorization;
using Hexaserver.Security;

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly IRepository _Repository;

        public AccountController(IRepository Repository)
        {
            _Repository = Repository;
        }
        
        [HttpPost]
        public Object CreateUser([FromBody]Player Item)
        { 
            if (!Auth.Identify(Context).Access)
                return HttpUnauthorized();

            if (!ModelState.IsValid)
                return HttpNotFound();

            _Repository.Add(Item);

            return true;
        }
    }
}