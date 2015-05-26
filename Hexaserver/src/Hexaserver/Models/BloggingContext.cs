﻿using System.Collections.Generic;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;

namespace Hexaserver.Models
{
    public class BloggingContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //var config = Startup.Configuration ?? new Configuration()
            //.AddJsonFile("config.json")
            //.AddEnvironmentVariables();

            //optionsBuilder.UseSqlServer(config.Get("Data:DefaultConnection:ConnectionString"));

            // Visual Studio 2015 | Use the LocalDb 12 instance created by Visual Studio

            //optionsBuilder.UseSqlServer(@"Server=(localdb)/blogging;Database=Blogging;integrated security=True;");
            optionsBuilder.UseSqlServer(@"Server = (localdb)\\ProjectsV12;Database=Hexaserver;Trusted_Connection=True;MultipleActiveResultSets=true");
           

            // Visual Studio 2013 | Use the LocalDb 11 instance created by Visual Studio
            //optionsBuilder.UseSqlServer(@"Server=(localdb)\v11.0;Database=Blogging;Trusted_Connection=True;");

            // Visual Studio 2012 | Use the SQL Express instance created by Visual Studio
            //optionsBuilder.UseSqlServer(@"Server=.\SQLEXPRESS;Database=Blogging;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Blog>()
                .Collection(b => b.Posts)
                .InverseReference(p => p.Blog)
                .ForeignKey(p => p.BlogId);
        }
    }

    public class Blog
    {
        public int BlogId { get; set; }
        public string Url { get; set; }

        public List<Post> Posts { get; set; }
    }

    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }
}