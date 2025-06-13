using Microsoft.AspNetCore.Http;

namespace SportShop.Server.Models.DTOs
{
    public class CreateProductFormDto
    {
        public string Title { get; set; } = default!;
        public short CategoryId { get; set; }
        public short GenderId { get; set; }
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public byte Rating { get; set; }
        public string Size1 { get; set; } = default!;
        public string Size2 { get; set; } = default!;
        public string Size3 { get; set; } = default!;
        public List<IFormFile> Images { get; set; } = new();
    }
}
