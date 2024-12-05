using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportShop.Server.data.Migrations
{
    /// <inheritdoc />
    public partial class AddCartImageFixTitleError : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "CartItems",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "CartItems");
        }
    }
}
