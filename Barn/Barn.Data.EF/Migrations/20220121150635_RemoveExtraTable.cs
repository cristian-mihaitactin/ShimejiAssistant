using Microsoft.EntityFrameworkCore.Migrations;

namespace Barn.Data.EF.Migrations
{
    public partial class RemoveExtraTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PluginNotification_BuckyProfile_BuckyProfileId",
                table: "PluginNotification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PluginNotification",
                table: "PluginNotification");

            migrationBuilder.RenameTable(
                name: "PluginNotification",
                newName: "BuckyBehaviour");

            migrationBuilder.RenameIndex(
                name: "IX_PluginNotification_BuckyProfileId",
                table: "BuckyBehaviour",
                newName: "IX_BuckyBehaviour_BuckyProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BuckyBehaviour",
                table: "BuckyBehaviour",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BuckyBehaviour_BuckyProfile_BuckyProfileId",
                table: "BuckyBehaviour",
                column: "BuckyProfileId",
                principalTable: "BuckyProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuckyBehaviour_BuckyProfile_BuckyProfileId",
                table: "BuckyBehaviour");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BuckyBehaviour",
                table: "BuckyBehaviour");

            migrationBuilder.RenameTable(
                name: "BuckyBehaviour",
                newName: "PluginNotification");

            migrationBuilder.RenameIndex(
                name: "IX_BuckyBehaviour_BuckyProfileId",
                table: "PluginNotification",
                newName: "IX_PluginNotification_BuckyProfileId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PluginNotification",
                table: "PluginNotification",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PluginNotification_BuckyProfile_BuckyProfileId",
                table: "PluginNotification",
                column: "BuckyProfileId",
                principalTable: "BuckyProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
