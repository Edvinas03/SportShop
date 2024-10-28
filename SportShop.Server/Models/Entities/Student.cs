using System.ComponentModel.DataAnnotations;

namespace SportShop.Server.Models.Entities
{
    public class Student(string firstName, string lastName, string email) : Entity<int>
    {
        [MaxLength(30)] public string FirstName { get; private set; } = firstName;
        [MaxLength(30)] public string LastName { get; private set; } = lastName;
        [MaxLength(40)] public string Email { get; private set; } = email;

        public void SetValues(string firstName, string lastName, string email)
            => (FirstName, LastName, Email) = (firstName, lastName, email);
    }
}
