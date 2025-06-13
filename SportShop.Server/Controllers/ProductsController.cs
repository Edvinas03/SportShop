using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Services;

namespace SportShop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IGetProductService getProductService, ICreateProductService createProductService) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? gender = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null)
        {
            var results = await getProductService.GetFiltered(
                page,
                pageSize,
                category,
                gender,
                minPrice,
                maxPrice
            );
            return Ok(results);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await getProductService.Get(id);
            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateProductFormDto dto)
        {
            var id = await createProductService.Create(dto);
            return CreatedAtAction(nameof(Get), new { id }, new { id });
        }
    }
}
