using Microsoft.AspNetCore.Mvc;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Services;
using System.Security.Claims;

namespace SportShop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController(ICartService cartService) : ControllerBase
    {
        [HttpPost("add")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add([FromBody] CartDto dto)
        {
            if (dto == null) return BadRequest("Invalid cart data.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            { 
            return Unauthorized("User not logged in.");
            }
            dto.UserId = userId;

            await cartService.Add(dto);
            return Ok("Item added to cart.");
        }

        [HttpPut("update")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update([FromBody] List<CartDto> dtoList)
        {
            if (dtoList == null || !dtoList.Any())
            {
                return BadRequest("Invalid cart data.");
            }

            await cartService.Update(dtoList);
            return Ok("Cart updated.");
        }

        [HttpGet("get")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Get([FromQuery] CartFilterDto dto)
        {
            if (dto == null) return BadRequest("Invalid filter data.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized("User not logged in.");

            dto.UserId = userId;
            var cartItems = await cartService.Get(dto);
            if (cartItems == null) return NotFound("No cart items found.");

            return Ok(cartItems);
        }

        [HttpDelete("remove")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Remove([FromQuery] int cartId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized("User not logged in.");

            await cartService.Remove(cartId, userId);
            return Ok("Item removed from cart.");
        }
    }
}
