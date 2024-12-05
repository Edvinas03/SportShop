namespace SportShop.Server.Models.DTOs
{
    public record ProductDto(
        short Id,
        string Title,
        string Category,
        string Gender,
        string Description,
        decimal Price,
        byte Rating,
        string Size1,
        string Size2,
        string Size3,
        ImageDto Image,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
