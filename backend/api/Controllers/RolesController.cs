using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    //api/roles
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            if (string.IsNullOrEmpty(createRoleDto.RoleName))
            {
                return BadRequest("Role name is required");
            }

            var roleExist = await _roleManager.RoleExistsAsync(createRoleDto.RoleName);

            if (roleExist)
            {
                return BadRequest("Role already exists");
            }

            var roleResult = await _roleManager.CreateAsync(new IdentityRole(createRoleDto.RoleName));

            if (roleResult.Succeeded)
            {
                return Ok(new { message = "Role created successfully" });
            }

            return BadRequest("Role creation failed");

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
        {
            // list of users with total user count
            var roles = await _roleManager.Roles.Select(role => new RoleResponseDto
            {
                Id = role.Id,
                Name = role.Name,
                TotalUsers = _userManager.GetUsersInRoleAsync(role.Name!).Result.Count
            }).ToListAsync();

            return Ok(roles);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            if (role is null)
            {
                return NotFound("Role not found");
            }

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role deleted successfully" });
            }

            return BadRequest("Role deletion failed");
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByIdAsync(assignRoleDto.UserId);

            if (user is null)
            {
                return NotFound("User not found");
            }

            var role = await _roleManager.FindByIdAsync(assignRoleDto.RoleId);

            if (role is null)
            {
                return NotFound("Role not found");
            }

            var result = await _userManager.AddToRoleAsync(user, role.Name!);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role assigned successfully" });
            }

            var error = result.Errors.FirstOrDefault();

            return BadRequest(error!.Description);
        }

        [HttpPost("unassign")]
        public async Task<IActionResult> UnassignRole([FromBody] AssignRoleDto unassignRoleDto)
        {
            var user = await _userManager.FindByIdAsync(unassignRoleDto.UserId);

            if (user is null)
            {
                return NotFound("User not found");
            }

            var role = await _roleManager.FindByIdAsync(unassignRoleDto.RoleId);

            if (role is null)
            {
                return NotFound("Role not found");
            }

            var result = await _userManager.RemoveFromRoleAsync(user, role.Name!);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role unassigned successfully" });
            }

            var error = result.Errors.FirstOrDefault();

            return BadRequest(error!.Description);
        }
    }
}