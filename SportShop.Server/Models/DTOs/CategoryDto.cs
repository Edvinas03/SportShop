namespace SportShop.Server.Models.DTOs
{
    public record CategoryDto(
        short Id, 
        string Title, 
        short ParentId
        );
}
