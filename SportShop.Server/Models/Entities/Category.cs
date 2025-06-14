using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SportShop.Server.Models.Entities
{
    public class Category : Entity<short>
    {
        [MaxLength(100)]
        public string Title { get; private set; }

        public short? ParentId { get; private set; }

        public List<Product> Products { get; set; } = new List<Product>();

        public List<Category> Subcategories { get; set; } = new List<Category>();

        public Category() { }

        public Category(string title, short? parentId)
        {
            Title = title;
            ParentId = parentId;
        }

        public void SetValues(string title, short? parentId)
            => (Title, ParentId) = (title, parentId);
    }
}