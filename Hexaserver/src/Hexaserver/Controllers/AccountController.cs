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

namespace Hexaserver.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly IAccountRepository _Repository;

        public AccountController(IAccountRepository Repository)
        {
            _Repository = Repository;
        }
        
        [Authorize]
        [HttpPost]
        public Object CreateUser([FromBody]Player Item)
        {
            if (!ModelState.IsValid)
                return HttpNotFound();

            _Repository.Add(Item);

            return true;
        }
    }
}
