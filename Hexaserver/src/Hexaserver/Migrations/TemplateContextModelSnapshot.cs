using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Metadata.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Infrastructure;
using Hexaserver.Data;

namespace Hexaserver.Migrations
{
    [ContextType(typeof(AccountContext))]
    partial class TemplateContextModelSnapshot : ModelSnapshot
    {
        public override IModel Model
        {
            get
            {
                var builder = new BasicModelBuilder()
                    .Annotation("SqlServer:ValueGeneration", "Identity");
                
                builder.Entity("Hexaserver.Models.Field", b =>
                    {
                        b.Property<int>("FieldId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 0)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<int>("PlayerId")
                            .Annotation("OriginalValueIndex", 0)
                            .Annotation("ShadowIndex", 1);
                        b.Property<int>("X")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 2);
                        b.Property<int>("Y")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 3);
                        b.Key("FieldId");
                    });
                
                builder.Entity("Hexaserver.Models.Friend", b =>
                    {
                        b.Property<string>("Avatar")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 0);
                        b.Property<int>("FriendId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 1)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<string>("Login")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 2);
                        b.Property<byte[]>("_Avatar")
                            .Annotation("OriginalValueIndex", 3)
                            .Annotation("ShadowIndex", 3);
                        b.Key("FriendId");
                    });
                
                builder.Entity("Hexaserver.Models.Player", b =>
                    {
                        b.Property<string>("AuthCode")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 0);
                        b.Property<string>("Avatar")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 1);
                        b.Property<int>("Crystal")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 2);
                        b.Property<string>("Email")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 3);
                        b.Property<int>("Gold")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 4);
                        b.Property<string>("HiddenToken")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 5);
                        b.Property<string>("Login")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 6);
                        b.Property<string>("Password")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 7);
                        b.Property<int>("PlayerId")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 8)
                            .Annotation("SqlServer:ValueGeneration", "Default");
                        b.Property<string>("Token")
                            .Annotation("OriginalValueIndex", -1)
                            .Annotation("ShadowIndex", 9);
                        b.Property<byte[]>("_Avatar")
                            .Annotation("OriginalValueIndex", 10)
                            .Annotation("ShadowIndex", 10);
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
