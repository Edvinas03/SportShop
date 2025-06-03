using Microsoft.EntityFrameworkCore;
using SportShop.Server.Data;
using SportShop.Server.Models.Entities;
using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services;

public class CartService(AppDbContext context) : ICartService
{
    public async Task Add(CartDto dto)
    {
        var cartItem = await context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == dto.UserId && c.ProductId == dto.ProductId && c.Size == dto.Size);

        if (cartItem == null)
        {
            cartItem = new CartItem
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Title = dto.Title,
                Price = dto.Price,
                UserId = dto.UserId,
                ImagePath = dto.ImagePath,
                IsBought = dto.IsBought,
                Size = dto.Size,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.CartItems.Add(cartItem);
        }
        else
        {
            cartItem.Quantity += dto.Quantity;
            cartItem.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
    }

    public async Task Update(List<CartDto> dtoList)
    {
        foreach (var dto in dtoList)
        {
            var cartItem = await context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == dto.UserId && c.ProductId == dto.ProductId && c.Size == dto.Size);

            if (cartItem != null)
            {
                cartItem.Quantity = dto.Quantity;
                cartItem.Price = dto.Price;
                cartItem.IsBought = dto.IsBought;
                cartItem.CanceledAt = dto.CanceledAt;
                cartItem.DeliveredAt = dto.DeliveredAt;
                cartItem.UpdatedAt = DateTime.UtcNow;
            }
        }

        await context.SaveChangesAsync();
    }

    public async Task<List<CartDto>> Get(CartFilterDto dto)
    {
        var query = context.CartItems
            .Include(c => c.Product)
            .ThenInclude(p => p.Images)
            .AsQueryable();

        if (!string.IsNullOrEmpty(dto.UserId))
        {
            query = query.Where(c => c.UserId == dto.UserId);
        }

        if (dto.IsBought)
        {
            query = query.Where(c => c.IsBought);
        }

        /*if (dto.IsCanceled)
        {
            query = query.Where(c => c.CanceledAt != null);
        }

        if (dto.IsDelivered)
        {
            query = query.Where(c => c.DeliveredAt != null);
        }*/

        var cartItems = await query.ToListAsync();

        return cartItems.Select(c => new CartDto
        {
            Id = c.Id,
            ProductId = c.ProductId,
            Title = c.Product != null ? c.Product.Title : "Unknown",
            ImagePath = c.Product?.Images?.FirstOrDefault()?.Path ?? string.Empty,
            Quantity = c.Quantity,
            Price = c.Price,
            UserId = c.UserId,
            IsBought = c.IsBought,
            CanceledAt = c.CanceledAt,
            DeliveredAt = c.DeliveredAt,
            Size = c.Size,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        }).ToList();
    }

    public async Task Remove(int cartId, string userId)
    {
        var cartItem = await context.CartItems
            .FirstOrDefaultAsync(c => c.Id == cartId && c.UserId == userId);

        if (cartItem != null)
        {
            context.CartItems.Remove(cartItem);
            await context.SaveChangesAsync();
        }
    }
}
