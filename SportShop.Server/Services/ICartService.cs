using SportShop.Server.Models.Entities;
using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface ICartService
    {
        Task Add(CartDto dto);
        Task Update(List<CartDto> dtoList);
        Task<List<CartDto>> Get(CartFilterDto dto);
        Task Remove(int cartId, string userId);
    }
}