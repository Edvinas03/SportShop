using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface IGetProductService
    {
        Task<List<ProductDto>> GetAll();
        Task<List<ProductDto>> GetPaginated(int page, int pageSize);
        Task<ProductDto> Get(int id);
        Task<List<ProductDto>> GetFiltered(
            int page,
            int pageSize,
            string? category = null,
            string? gender = null,
            decimal? minPrice = null,
            decimal? maxPrice = null
        );
    }
}