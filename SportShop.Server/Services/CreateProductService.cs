using SportShop.Server.Data;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Models.Entities;

namespace SportShop.Server.Services
{
    public class CreateProductService(AppDbContext context, IWebHostEnvironment env) : ICreateProductService
    {
        public async Task<short> Create(CreateProductFormDto dto)
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

            if (string.IsNullOrEmpty(env.WebRootPath))
                throw new InvalidOperationException("WebRootPath is null or empty");

            var imagesDir = Path.Combine(env.WebRootPath, "images");
            Directory.CreateDirectory(imagesDir);

            int i = 1;
            foreach (var file in dto.Images)
            {
                if (file?.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName);
                    if (string.IsNullOrEmpty(extension)) extension = ".jpg";

                    var fileName = $"product{product.Id}_{i++}{extension}";
                    var savePath = Path.Combine(imagesDir, fileName);

                    using var stream = new FileStream(savePath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    var image = new Image(product.Id, fileName, dto.Title)
                    {
                        Product = product
                    };

                    context.Images.Add(image);
                }
            }

            await context.SaveChangesAsync();
            return product.Id;
        }
    }
}
