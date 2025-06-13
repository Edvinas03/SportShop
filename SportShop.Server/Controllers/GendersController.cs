using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportShop.Server.Data;

namespace SportShop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GendersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var genders = await context.Genders
                .Select(g => new { g.Id, g.Name })
                .ToListAsync();
            return Ok(genders);
        }
    }
}
