using System.Collections.Generic;
using Microsoft.Data.Entity.Relational.Migrations;
using Microsoft.Data.Entity.Relational.Migrations.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Operations;

namespace Hexaserver.Migrations
{
    public partial class Init : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.CreateTable(
                name: "Friend",
                columns: table => new
                {
                    Avatar = table.Column(type: "nvarchar(max)", nullable: true),
                    FriendId = table.Column(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGeneration", "Identity"),
                    Login = table.Column(type: "nvarchar(max)", nullable: true),
                    _Avatar = table.Column(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friend", x => x.FriendId);
                });
            migration.CreateTable(
                name: "Player",
                columns: table => new
                {
                    AuthCode = table.Column(type: "nvarchar(max)", nullable: true),
                    Avatar = table.Column(type: "nvarchar(max)", nullable: true),
                    Crystal = table.Column(type: "int", nullable: false),
                    Email = table.Column(type: "nvarchar(max)", nullable: true),
                    Gold = table.Column(type: "int", nullable: false),
                    HiddenToken = table.Column(type: "nvarchar(max)", nullable: true),
                    Login = table.Column(type: "nvarchar(max)", nullable: true),
                    Password = table.Column(type: "nvarchar(max)", nullable: true),
                    PlayerId = table.Column(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGeneration", "Identity"),
                    Token = table.Column(type: "nvarchar(max)", nullable: true),
                    _Avatar = table.Column(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.PlayerId);
                });
            migration.CreateTable(
                name: "Field",
                columns: table => new
                {
                    FieldId = table.Column(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGeneration", "Identity"),
                    PlayerId = table.Column(type: "int", nullable: false),
                    X = table.Column(type: "int", nullable: false),
                    Y = table.Column(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Field", x => x.FieldId);
                    table.ForeignKey(
                        name: "FK_Field_Player_PlayerId",
                        columns: x => x.PlayerId,
                        referencedTable: "Player",
                        referencedColumn: "PlayerId");
                });
        }
        
        public override void Down(MigrationBuilder migration)
        {
            migration.DropTable("Field");
            migration.DropTable("Friend");
            migration.DropTable("Player");
        }
    }
}
