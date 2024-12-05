using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.ComponentModel.DataAnnotations;

namespace SportShop.Server.Models.Entities
{
    public class Product(string title, short categoryId, short genderId, string description,
        decimal price, byte rating, string size1, string size2, string size3) : Entity<short>
    {
        [MaxLength(100)] public string Title { get; private set; } = title;
        public short CategoryId { get; private set; } = categoryId;
        public short GenderId { get; private set; } = genderId;
        public string Description { get; private set; } = description;
        public decimal Price { get; private set; } = price;
        public byte Rating { get; private set; } = rating;
        public string Size1 { get; private set; } = size1;
        public string Size2 { get; private set; } = size2;
        public string Size3 { get; private set; } = size3;
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public DateTime UpdatedAt { get; private set; } = DateTime.Now;

        public Category Category { get; set; }
        public Gender Gender { get; set; }

        public List<Image> Images { get; set; } = [];

        public void SetValues(string title, short categoryId, short genderId, string description,
        decimal price, byte rating, string size1, string size2, string size3)
        {
            Title = title;
            CategoryId = categoryId;
            GenderId = genderId;
            Description = description;
            Price = price;
            Rating = rating;
            Size1 = size1;
            Size2 = size2;  
            Size3 = size3;
            UpdatedAt = DateTime.Now;
        }
    }
}
