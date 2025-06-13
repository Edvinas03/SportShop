using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportShop.Server.Data;

namespace SportShop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await context.Categories
                .Select(c => new { c.Id, c.Title })
                .ToListAsync();
            return Ok(categories);
        }
    }
}
