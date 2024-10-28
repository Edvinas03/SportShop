using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SportShop.Server.Models.Entities;

namespace SportShop.Server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext(options)
    {

        public DbSet<Student> Students { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.ConfigureWarnings(warnings => warnings.Ignore(CoreEventId.NavigationBaseIncludeIgnored, CoreEventId.NavigationBaseIncluded));
            //optionsBuilder.EnableSensitiveDataLogging();
        }
    }
}