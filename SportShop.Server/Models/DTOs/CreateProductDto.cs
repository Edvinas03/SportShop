using SportShop.Server.Models.DTOs;

public record CreateProductDto(
    string Title,
    short CategoryId,
    short GenderId,
    string Description,
    decimal Price,
    byte Rating,
    string Size1,
    string Size2,
    string Size3,
    List<ImageDto> Images
);