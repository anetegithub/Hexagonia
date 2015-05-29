using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;
using Hexaserver.Data;
using Microsoft.Framework.Logging;

namespace Hexaserver.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ILogger AccountLogger = Startup.LoggerFactory.CreateLogger<AccountRepository>();

        public IEnumerable<Player> AllItems
        {
            get
            {

                using (var db = new AccountContext())
                {
                    return db.Players.Include(x => x.Field).Include(x => x.Friends);
                }
            }
        }

        public void Add(Player item)
        {
            using (var db = new AccountContext())
            {
                db.Players.Add(item);
                db.Fields.Add(item.Field);
                db.SaveChanges();
            }
        }

        public Player GetById(int id)
        {
            using (var db = new AccountContext())
            {
                return db.Players.Where(x => x.PlayerId == id).Include(x => x.Field).Include(x => x.Friends).First();
            }
        }

        public bool TryDelete(int id)
        {
            try
            {
                using (var db = new AccountContext())
                {
                    db.Players.Remove(GetById(id));
                    db.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                AccountLogger.LogDebug(ex.ToString());
                return false;
            }
        }
    }
}