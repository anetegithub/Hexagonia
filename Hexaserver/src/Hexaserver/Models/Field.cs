using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Models
{
    public class Field
    {
        [Key, ForeignKey("Player")]
        public int PlayerId { get; set; }

        public Int32 FieldId { get; set; }

        public Int32 X { get; set; } = 5;
        public Int32 Y { get; set; } = 8;
        
        public virtual Player Player { get; set; }
    }
}