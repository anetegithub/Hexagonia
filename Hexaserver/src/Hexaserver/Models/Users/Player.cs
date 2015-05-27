using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Models
{
    public class Player
    {
        public Int32 PlayerId { get; set; }

        public byte[] _Avatar { get; set; }
        public String Avatar { get; set; }

        public String Login { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public String AuthCode { get; set; }
        public String Token { get; set; }
        public String HiddenToken { get; set; }

        public Int32 Gold { get; set; }
        public Int32 Crystal { get; set; }

        public virtual ICollection<Friend> Friend { get; set; }
    }
}