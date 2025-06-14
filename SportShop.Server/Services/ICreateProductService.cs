using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface ICreateProductService
    {
        Task<short> Create(CreateProductFormDto dto);
        Task Update(int id, CreateProductFormDto dto);
        Task Delete(int id);
    }
}