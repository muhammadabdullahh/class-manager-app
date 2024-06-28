using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Role name is required")]
        public string RoleName { get; set; } = null!;
    }
}