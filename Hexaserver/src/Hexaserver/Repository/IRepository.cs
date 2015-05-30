using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;

namespace Hexaserver.Repository
{
    public interface IRepository
    {
        IEnumerable<Player> AllItems { get; }
        void Add(Player item);
        Player GetById(int id);
        bool TryDelete(int id);
    }
}