using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Hexaserver.Models
{
    public class TodoItem
    {
        public Int32 Id { get; set; }

        [Required]
        public String Title { get; set; }

        public Boolean IsDone { get; set; }
    }
}
