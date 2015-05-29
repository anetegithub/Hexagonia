using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

namespace Hexaserver.Extensions
{
    public static class ObjectExtensions
    {
        public static String ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        public static Boolean HasProperty(dynamic thisD, String PropertyName)
        {
            return thisD.GetType().GetProperty(PropertyName) != null;
        }
    }
}