﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hexaserver.Models;

namespace Hexaserver.Repository
{
    public interface IRepository<T>
    {
        IEnumerable<T> AllItems { get; }
        void Add(T item);
        T GetById(int id);
        bool TryDelete(int id);
    }
}