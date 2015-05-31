using System.Collections.Generic;
using Microsoft.Data.Entity.Relational.Migrations;
using Microsoft.Data.Entity.Relational.Migrations.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Operations;

namespace Hexaserver.Migrations
{
    public partial class PlayerClassCut : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.DropColumn(name: "AuthCode", table: "Player");
            migration.DropColumn(name: "HiddenToken", table: "Player");
            migration.DropColumn(name: "Token", table: "Player");
        }
        
        public override void Down(MigrationBuilder migration)
        {
            migration.AddColumn(
                name: "AuthCode",
                table: "Player",
                type: "nvarchar(max)",
                nullable: true);
            migration.AddColumn(
                name: "HiddenToken",
                table: "Player",
                type: "nvarchar(max)",
                nullable: true);
            migration.AddColumn(
                name: "Token",
                table: "Player",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
