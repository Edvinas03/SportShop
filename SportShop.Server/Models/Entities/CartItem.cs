namespace SportShop.Server.Models.Entities;

public class CartItem : Entity<int>
{
    public short ProductId { get; set; }
    public Product Product { get; set; }
    public string Title { get; set; }
    public short Quantity { get; set; }
    public decimal Price { get; set; }
    public string UserId { get; set; }
    public string ImagePath { get; set; }
    public bool IsBought { get; set; }
    public DateTime? CanceledAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
