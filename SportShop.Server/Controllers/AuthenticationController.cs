using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using SportShop.Server.Models.DTOs;
using SportShop.Server.Services;

namespace SportShop.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger)
        : ControllerBase
    {
        [HttpPost("signin")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(error: "Invalid payload");
                var (status, authDto) = await authService.Login(model, HttpContext);
                if (status == 0)
                    return BadRequest(authDto.Message);
                return Ok(authDto);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Register(RegistrationDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(error: "Invalid payload");
                var (status, message) = await authService.Registration(model);
                if (status == 0)
                    return BadRequest(message);
                return CreatedAtAction(nameof(Register), model);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("check-session")]
        public IActionResult CheckSession()
            => Ok(authService.CheckSession(HttpContext));

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await authService.Logout(HttpContext);
            return Ok(new { message = "Logout successful" });
        }

        [HttpGet("csrf-token")]
        public IActionResult GetCsrfToken()
        {
            var antiforgery = HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
            var tokens = antiforgery.GetAndStoreTokens(HttpContext);
            return Ok(new { token = tokens.RequestToken });
        }
    }
}
