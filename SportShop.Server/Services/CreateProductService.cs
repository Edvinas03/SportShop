using SportShop.Server.Data;
using SportShop.Server.Models.Entities;

public class CreateProductService(AppDbContext context) : ICreateProductService
{

    public async Task<short> Create(CreateProductDto dto)
    {
        var product = new Product(
            dto.Title,
            dto.CategoryId,
            dto.GenderId,
            dto.Description,
            dto.Price,
            dto.Rating,
            dto.Size1,
            dto.Size2,
            dto.Size3
        );

        context.Products.Add(product);
        await context.SaveChangesAsync();

        foreach (var image in dto.Images)
        {
            var img = new Image(product.Id, image.Path, image.Title)
            {
                Product = product
            };
            context.Images.Add(img);
        }

        await context.SaveChangesAsync();
        return product.Id;
    }
}
