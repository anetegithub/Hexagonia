using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Models
{
    public class Friend
    {
        public Friend()
        {
            this.Players = new HashSet<Player>();
        }

        public Int32 FriendId { get; set; }

        public byte[] _Avatar { get; set; }
        public String Avatar { get; set; }
        public String Login { get; set; }
        
        public virtual ICollection<Player> Players { get; set; }
    }
}