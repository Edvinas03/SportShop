using Microsoft.EntityFrameworkCore;
using SportShop.Server.Data;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Models.Entities;

namespace SportShop.Server.Services
{
    public class GetProductService(AppDbContext context) : IGetProductService
    {

        public async Task<List<ProductDto>> GetAll()
        {
            var products = await context.Products
                .Include(i => i.Category)
                .Include(i => i.Gender)
                .Include(i => i.Images)
                .ToListAsync();

            return products.Select(MapDto).ToList();
        }

        public async Task<List<ProductDto>> GetFiltered(
              int page,
              int pageSize,
              string? category = null,
              string? gender = null,
              decimal? minPrice = null,
              decimal? maxPrice = null)
        {
            var query = context.Products
                .Include(i => i.Category)
                .Include(i => i.Gender)
                .Include(i => i.Images)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.Title.Contains(category));
            }

            if (!string.IsNullOrEmpty(gender))
            {
                query = query.Where(p => p.Gender.Name.Contains(gender));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return products.Select(MapDto).ToList();
        }

        public async Task<List<ProductDto>> GetPaginated(int page, int pageSize)
        {
            var products = await context.Products
                .Include(i => i.Category)
                .Include(i => i.Gender)
                .Include(i => i.Images)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return products.Select(MapDto).ToList();
        }

        public async Task<ProductDto> Get(int id)
        {
            var product = await context.Products
                .Include(i => i.Category)
                .Include(i => i.Gender)
                .Include(i => i.Images)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (product == null)
            {
                return null;
            }

            return MapDto(product);
        }

        public ProductDto MapDto(Product product)
        {
            var imageDtos = product.Images
                .Select(image => new ImageDto(image.Path, image.Title))
                .ToList();

            return new ProductDto(
                product.Id,
                product.Title,
                product.Category.Title,
                product.Gender.Name,
                product.Description,
                product.Price,
                product.Rating,
                product.Size1,
                product.Size2,
                product.Size3,
                imageDtos,
                product.CreatedAt,
                product.UpdatedAt
            );
        }
    }
}