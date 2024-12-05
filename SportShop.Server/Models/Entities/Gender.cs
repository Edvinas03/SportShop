using System.ComponentModel.DataAnnotations;

namespace SportShop.Server.Models.Entities
{
    public class Gender(string name) : Entity<short>
    {
        [MaxLength(100)] public string Name { get; private set; } = name;
        public List<Product> Products { get; set; } = [];
        public void SetValues(string name)
    => (Name) = (name);
    }
}