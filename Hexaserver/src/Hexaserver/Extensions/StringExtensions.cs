using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Hexaserver.Extensions
{
    public static class StringExtensions
    {
        public static T ParseToType<T>(this String str)
        {
            return JsonConvert.DeserializeObject<T>(str);
        }

        public static dynamic ParseToDynamic(this String str)
        {
                return JObject.Parse(str);
        }
    }
}