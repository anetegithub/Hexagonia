using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Metadata.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Infrastructure;
using Hexaserver.Data;

namespace Hexaserver.Migrations
{
    [ContextType(typeof(AccountContext))]
    partial class Init
    {
        public override string Id
        {
            get { return "20150529042742_Init"; }
        }
        
        public override string ProductVersion
        {
            get { return "7.0.0-beta4-12943"; }
        }
        
        public override IModel Target
        {
            get
            {
                var builder = new BasicModelBuilder()
                    .Annotation("SqlServer:ValueGeneration", "Identity");
                
                builder.Entity("Hexaserver.Models.Field", b =>
                    {
                        b.Property<int>("FieldId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 0)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<int>("PlayerId")
                            .Annotation("OriginalValueIndex", 1);
                        b.Property<int>("X")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<int>("Y")
                            .Annotation("OriginalValueIndex", 3);
                        b.Key("FieldId");
                    });
                
                builder.Entity("Hexaserver.Models.Friend", b =>
                    {
                        b.Property<string>("Avatar")
                            .Annotation("OriginalValueIndex", 0);
                        b.Property<int>("FriendId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 1)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<string>("Login")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<byte[]>("_Avatar")
                            .Annotation("OriginalValueIndex", 3);
                        b.Key("FriendId");
                    });
                
                builder.Entity("Hexaserver.Models.Player", b =>
                    {
                        b.Property<string>("AuthCode")
                            .Annotation("OriginalValueIndex", 0);
                        b.Property<string>("Avatar")
                            .Annotation("OriginalValueIndex", 1);
                        b.Property<int>("Crystal")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<string>("Email")
                            .Annotation("OriginalValueIndex", 3);
                        b.Property<int>("Gold")
                            .Annotation("OriginalValueIndex", 4);
                        b.Property<string>("HiddenToken")
                            .Annotation("OriginalValueIndex", 5);
                        b.Property<string>("Login")
                            .Annotation("OriginalValueIndex", 6);
                        b.Property<string>("Password")
                            .Annotation("OriginalValueIndex", 7);
                        b.Property<int>("PlayerId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 8)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<string>("Token")
                            .Annotation("OriginalValueIndex", 9);
                        b.Property<byte[]>("_Avatar")
                            .Annotation("OriginalValueIndex", 10);
                        b.Key("PlayerId");
                    });
                
                builder.Entity("Hexaserver.Models.Field", b =>
                    {
                        b.ForeignKey("Hexaserver.Models.Player", "PlayerId");
                    });
                
                return builder.Model;
            }
        }
    }
}
