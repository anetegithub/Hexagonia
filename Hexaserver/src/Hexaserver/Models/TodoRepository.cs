using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexaserver.Models
{
    public class TodoRepository : ITodoRepository
    {
        readonly List<TodoItem> _items = new List<TodoItem>()
        {
            new TodoItem() { Id=0, Title="Create asp.net 5 project", IsDone=true },
            new TodoItem() { Id=1, Title="Add Web.API to asp.net 5 project", IsDone=true },
            new TodoItem() { Id=2, Title="Test asp.net 5  web api", IsDone=true},
            new TodoItem() { Id=2, Title="Add entity framework"},
        };

        public IEnumerable<TodoItem> AllItems
        {
            get
            {
                return _items;
            }
        }

        public TodoItem GetById(int id)
        {
            return _items.FirstOrDefault(x => x.Id == id);
        }

        public void Add(TodoItem item)
        {
            item.Id = 1 + _items.Max(x => (int?)x.Id) ?? 0;
            _items.Add(item);
        }

        public bool TryDelete(int id)
        {
            var item = GetById(id);
            if (item == null)
            {
                return false;
            }
            _items.Remove(item);
            return true;
        }
    }
}