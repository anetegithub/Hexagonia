using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;

namespace Hexaserver.Repository
{
    public class FakeRepository : IRepository
    {
        private List<Player> List = new List<Player>()
        {
            new Player() { PlayerId=1, Login="Admin", Password="11" }
        };
        public IEnumerable<Player> AllItems
        {
            get
            {
                return List;
            }
        }

        public void Add(Player item)
        {
            List.Add(item);
        }

        public Player GetById(int id)
        {
            return List.Where(x => x.PlayerId == id).FirstOrDefault();
        }

        public bool TryDelete(int id)
        {
            List.Remove(GetById(id));
            return true;
        }
    }
}
