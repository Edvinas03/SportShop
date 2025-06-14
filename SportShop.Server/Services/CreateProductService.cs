using Microsoft.EntityFrameworkCore;
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
        public async Task Update(int id, CreateProductFormDto dto)
        {
            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product is null) throw new Exception("Produktas nerastas");

            product.SetValues(dto.Title, dto.CategoryId, dto.GenderId, dto.Description,
                dto.Price, dto.Rating, dto.Size1, dto.Size2, dto.Size3);

            if (!string.IsNullOrEmpty(env.WebRootPath) && dto.Images is not null && dto.Images.Count > 0)
            {
                foreach (var img in product.Images)
                {
                    var path = Path.Combine(env.WebRootPath, "images", img.Path);
                    if (File.Exists(path)) File.Delete(path);
                }
                context.Images.RemoveRange(product.Images);

                int i = 1;
                foreach (var file in dto.Images)
                {
                    if (file?.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName);
                        if (string.IsNullOrEmpty(extension)) extension = ".jpg";

                        var fileName = $"product{product.Id}_{i++}{extension}";
                        var savePath = Path.Combine(env.WebRootPath, "images", fileName);

                        using var stream = new FileStream(savePath, FileMode.Create);
                        await file.CopyToAsync(stream);

                        context.Images.Add(new Image(product.Id, fileName, dto.Title)
                        {
                            Product = product
                        });
                    }
                }
            }

            await context.SaveChangesAsync();
        }
        public async Task Delete(int id)
        {
            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product is null) throw new Exception("Produktas nerastas");

            foreach (var img in product.Images)
            {
                var path = Path.Combine(env.WebRootPath, "images", img.Path);
                if (File.Exists(path)) File.Delete(path);
            }

            context.Images.RemoveRange(product.Images);
            context.Products.Remove(product);
            await context.SaveChangesAsync();
        }
    }
}
