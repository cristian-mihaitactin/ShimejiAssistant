using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Barn.Data.EF.Migrations
{
    public partial class AddBuckyProfileAndBehaviours : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BuckyProfileID",
                table: "UserPreferences",
                type: "uniqueidentifier",
                nullable: true,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "BuckyProfile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuckyProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BuckyBehaviour",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionType = table.Column<int>(type: "int", nullable: false),
                    ImageBlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuckyProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuckyBehaviour", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuckyBehaviour_BuckyProfile_BuckyProfileId",
                        column: x => x.BuckyProfileId,
                        principalTable: "BuckyProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "ConcurrencyStamp",
                value: "5223ca42-ba77-4e03-961b-d197b54d046f");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_BuckyProfileID",
                table: "UserPreferences",
                column: "BuckyProfileID",
                unique: false);

            migrationBuilder.CreateIndex(
                name: "IX_BuckyBehaviour_BuckyProfileId",
                table: "BuckyBehaviour",
                column: "BuckyProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreferences_BuckyProfile_BuckyProfileID",
                table: "UserPreferences",
                column: "BuckyProfileID",
                principalTable: "BuckyProfile",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPreferences_BuckyProfile_BuckyProfileID",
                table: "UserPreferences");

            migrationBuilder.DropTable(
                name: "BuckyBehaviour");

            migrationBuilder.DropTable(
                name: "BuckyProfile");

            migrationBuilder.DropIndex(
                name: "IX_UserPreferences_BuckyProfileID",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "BuckyProfileID",
                table: "UserPreferences");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "ConcurrencyStamp",
                value: "b4552d84-b114-436a-a315-b19071db69ad");
        }
    }
}
