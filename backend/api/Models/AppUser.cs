using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }
        public ICollection<Course>? Courses { get; set; }

    }
}


