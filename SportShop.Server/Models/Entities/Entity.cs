using System.ComponentModel.DataAnnotations;

namespace SportShop.Server.Models.Entities
{
    public abstract class Entity<T>
    {
        [Key] public T Id { get; protected set; }
    }
}
