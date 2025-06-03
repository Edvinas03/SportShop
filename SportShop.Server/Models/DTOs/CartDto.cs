using SportShop.Server.Models.Entities;

namespace SportShop.Server.Models.DTOs;

public class CartDto
{
    public int? Id { get; set; }
    public short ProductId { get; set; }
    public string Title { get; set; }
    public string ImagePath { get; set; }
    public short Quantity { get; set; }
    public decimal Price { get; set; }
    public string UserId { get; set; } = string.Empty;
    public bool IsBought { get; set; }
    public string Size { get; set; } = string.Empty;
    public DateTime? CanceledAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

