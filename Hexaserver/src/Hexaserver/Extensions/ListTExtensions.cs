using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Extensions
{
    public static class ListTExtensions
    {
        public static T I<T>(this IList<T> List, T Key)
        {          
            return List[List.IndexOf(Key)];
        }
    }
}
