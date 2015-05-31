using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;

namespace Hexaserver.Repository
{
    public interface IPlayerRepository :IRepository<Player>
    {
        /// <summary>
        /// Be care! 
        /// </summary>
        /// <param name="Login">user login</param>
        /// <returns></returns>
        Player GetByLogin(string Login);
    }
}