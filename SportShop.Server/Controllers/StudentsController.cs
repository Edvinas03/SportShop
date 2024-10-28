using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Services;

namespace SportShop.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]


public class StudentsController(IGetStudentService getStudentService, ISaveStudentService saveStudentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var results = await getStudentService.GetAll();
        return Ok(results);
    }

    [HttpPut(template: "{id:int}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Put(int id, StudentDto dto)
    {
        await saveStudentService.Update(id, dto);
        return Ok();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Post(StudentDto dto)
    {
        await saveStudentService.Store(dto);
        return Ok();
    }

    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        await saveStudentService.Delete(id);
        return Ok();
    }
}