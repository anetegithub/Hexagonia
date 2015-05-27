using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Models
{
    public class Field
    {
        public Int32 FieldId { get; set; }
        public Int32 X { get; set; }
        public Int32 Y { get; set; }

        public Int32 PlayerId { get; set; }
    }
}
