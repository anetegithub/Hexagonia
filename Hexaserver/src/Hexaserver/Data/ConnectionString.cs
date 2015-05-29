using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Data
{
    public static class ConnectionString
    {
        public static String Default
        {
            get { return Local; }
        }

        public static String Local
        {
            get { return @"Server=(localdb)\mssqllocaldb;Database=Template;Trusted_Connection=True;"; }
        }

        public static String Azure
        {
            get { return @"Azure"; }
        }
    }
}
