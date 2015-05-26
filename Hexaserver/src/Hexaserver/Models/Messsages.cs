using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Infrastructure;

public class Message
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
}

public class HelloWorldContext : DbContext
{
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Message>().Key(m => m.Id);
        base.OnModelCreating(builder);
    }
}