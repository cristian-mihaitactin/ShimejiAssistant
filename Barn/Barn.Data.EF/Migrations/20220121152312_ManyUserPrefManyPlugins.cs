using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Barn.Data.EF.Migrations
{
    public partial class ManyUserPrefManyPlugins : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plugin_UserPreferences_UserPreferencesId",
                table: "Plugin");

            migrationBuilder.DropIndex(
                name: "IX_Plugin_UserPreferencesId",
                table: "Plugin");

            migrationBuilder.DropColumn(
                name: "UserPreferencesId",
                table: "Plugin");

            migrationBuilder.CreateTable(
                name: "UserPreferencesPlugins",
                columns: table => new
                {
                    UserPreferenceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PluginId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferencesPlugins", x => new { x.UserPreferenceId, x.PluginId });
                    table.ForeignKey(
                        name: "FK_UserPreferencesPlugins_Plugin_PluginId",
                        column: x => x.PluginId,
                        principalTable: "Plugin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPreferencesPlugins_UserPreferences_UserPreferenceId",
                        column: x => x.UserPreferenceId,
                        principalTable: "UserPreferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferencesPlugins_PluginId",
                table: "UserPreferencesPlugins",
                column: "PluginId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPreferencesPlugins");

            migrationBuilder.AddColumn<Guid>(
                name: "UserPreferencesId",
                table: "Plugin",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Plugin_UserPreferencesId",
                table: "Plugin",
                column: "UserPreferencesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plugin_UserPreferences_UserPreferencesId",
                table: "Plugin",
                column: "UserPreferencesId",
                principalTable: "UserPreferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
