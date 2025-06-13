using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface ICreateProductService
    {
        Task<short> Create(CreateProductFormDto dto);
    }
}