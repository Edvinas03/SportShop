using System.ComponentModel.DataAnnotations;

namespace SportShop.Server.Models.Entities
{
    public class Image(short productId, string path, string title) : Entity<short>
    {
        public short ProductId { get; private set; } = productId;
        [MaxLength(100)] public string Path { get; private set; } = path;
        [MaxLength(100)] public string Title { get; private set; } = title;

        public Product Product { get; set; }

        public void SetValues(short productId, string path, string title)
    => (ProductId, Path, Title) = (productId, path, title);
    }
}