using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public interface IAuthService
    {
        Task<(int, string)> Registration(RegistrationDto model);
        Task<(int, AuthDto)> Login(LoginDto model, HttpContext httpContext);
        AuthDto CheckSession(HttpContext httpContext);
        Task Logout(HttpContext httpContext);
    }
}
