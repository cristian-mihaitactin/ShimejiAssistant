using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Barn.Data.EF.Migrations
{
    public partial class AddPlugins : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuckyBehaviour_BuckyProfile_BuckyProfileId",
                table: "BuckyBehaviour");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BuckyBehaviour",
                table: "BuckyBehaviour");

            migrationBuilder.DeleteData(
                table: "UserPreferences",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

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

            migrationBuilder.CreateTable(
                name: "Plugin",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Version = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserPreferencesId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plugin", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plugin_UserPreferences_UserPreferencesId",
                        column: x => x.UserPreferencesId,
                        principalTable: "UserPreferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PluginNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActionType = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PluginId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PluginNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PluginNotifications_Plugin_PluginId",
                        column: x => x.PluginId,
                        principalTable: "Plugin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plugin_UserPreferencesId",
                table: "Plugin",
                column: "UserPreferencesId");

            migrationBuilder.CreateIndex(
                name: "IX_PluginNotifications_PluginId",
                table: "PluginNotifications",
                column: "PluginId");

            migrationBuilder.AddForeignKey(
                name: "FK_PluginNotification_BuckyProfile_BuckyProfileId",
                table: "PluginNotification",
                column: "BuckyProfileId",
                principalTable: "BuckyProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PluginNotification_BuckyProfile_BuckyProfileId",
                table: "PluginNotification");

            migrationBuilder.DropTable(
                name: "PluginNotifications");

            migrationBuilder.DropTable(
                name: "Plugin");

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

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), 0, "167da51e-db25-430e-8186-06060106abd0", "dave.test@test.com", false, null, null, false, null, null, null, null, null, false, null, false, "Dave Coffee" });

            migrationBuilder.InsertData(
                table: "UserPreferences",
                columns: new[] { "Id", "BuckyProfileID", "UserId" },
                values: new object[] { new Guid("22222222-2222-2222-2222-222222222222"), new Guid("00000000-0000-0000-0000-000000000000"), new Guid("11111111-1111-1111-1111-111111111111") });

            migrationBuilder.AddForeignKey(
                name: "FK_BuckyBehaviour_BuckyProfile_BuckyProfileId",
                table: "BuckyBehaviour",
                column: "BuckyProfileId",
                principalTable: "BuckyProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
