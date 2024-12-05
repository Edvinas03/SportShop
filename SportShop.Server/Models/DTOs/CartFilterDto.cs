namespace SportShop.Server.Models.DTOs
{
    public class CartFilterDto
    {
        public string? UserId { get; set; }
        public bool IsBought { get; set; }
        public DateTime? CanceledAt { get; set; }
        public DateTime? DeliveredAt { get; set; }
    }
}
