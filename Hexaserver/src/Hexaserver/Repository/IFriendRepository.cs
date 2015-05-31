using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;

namespace Hexaserver.Repository
{
    public interface IFriendRepository :IRepository<Friend>
    {
        Friend GetByName(string Name);
    }
}