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
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateProductFormDto dto)
        {
            await createProductService.Update(id, dto);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await createProductService.Delete(id);
            return Ok();
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllWithoutPagination()
        {
            var products = await getProductService.GetAll();
            return Ok(products);
        }
    }
}
