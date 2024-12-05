using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using SportShop.Server.Data.Consts;
using SportShop.Server.Models.DTOs;

namespace SportShop.Server.Services
{
    public class AuthService(
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager)
        : IAuthService
    {
        public async Task<(int, string)> Registration(RegistrationDto model)
        {
            var userExists = await userManager.FindByEmailAsync(model.Email ?? string.Empty);
            if (userExists != null)
                return (0, "Email already exists");

            var user = new IdentityUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName
            };
            var createUserResult = await userManager.CreateAsync(user, model?.Password ?? string.Empty);
            if (!createUserResult.Succeeded)
            {
                var errors = string.Join(", ", createUserResult.Errors.Select(e => e.Description));
                return (0, $"User creation failed! Errors: {errors}");
            }

            var role = UserRoles.User;

            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));

            await userManager.AddToRoleAsync(user, role);

            return (1, "User created successfully!");
        }

        public async Task<(int, AuthDto)> Login(LoginDto model, HttpContext httpContext)
        {
            var user = await userManager.FindByEmailAsync(model?.Email ?? string.Empty);
            if (user == null)
                return (0, new AuthDto(false, "Invalid email", null, null));

            if (!await userManager.CheckPasswordAsync(user, model?.Password ?? string.Empty))
                return (0, new AuthDto(false, "Invalid password", null, null));

            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, model?.Email ?? string.Empty),
                new(ClaimTypes.NameIdentifier, user.Id)
            };

            var roles = await userManager.GetRolesAsync(user);

            foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
            };

            await httpContext.SignInAsync(IdentityConstants.ApplicationScheme,
                new ClaimsPrincipal(claimsIdentity), authProperties);

            return (1, new AuthDto(true, "Login successful", user.UserName, user.Email, roles[0], user.Id));
        }

        public AuthDto CheckSession(HttpContext httpContext)
        {
            var user = httpContext.User;
            var roles = user.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();

            if (user.Identity is not { IsAuthenticated: true })
                return new AuthDto(false, "User is not authenticated");

            var userName = user.Identity.Name;
            var userEmail = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            return new AuthDto(true, "User is authenticated", userName, userEmail, roles.FirstOrDefault(), userId);
        }

        public async Task Logout(HttpContext httpContext)
        {
            await httpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        }
    }
}
