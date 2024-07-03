using api.Data;
using api.Dtos.Course;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public CourseController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Course
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
        {
            var courses = await _context.Courses.Include(c => c.User).ToListAsync();
            var courseDtos = courses.Select(course => new CourseDto
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CourseCode = course.CourseCode,
                InstructorName = course.InstructorName,
                Credits = course.Credits,
                TargetGrade = course.TargetGrade,
                Semester = course.Semester,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                SyllabusURL = course.SyllabusURL,
                Notes = course.Notes,
                UserID = course.UserID
            }).ToList();

            return Ok(courseDtos);
        }

        // GET: api/Course/User/{userId}
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetUserCourses(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var courses = await _context.Courses.Where(c => c.UserID == userId).Include(c => c.User).ToListAsync();
            var courseDtos = courses.Select(course => new CourseDto
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CourseCode = course.CourseCode,
                InstructorName = course.InstructorName,
                Credits = course.Credits,
                TargetGrade = course.TargetGrade,
                Semester = course.Semester,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                SyllabusURL = course.SyllabusURL,
                Notes = course.Notes,
                UserID = course.UserID
            }).ToList();

            return Ok(courseDtos);
        }

        // GET: api/Course/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _context.Courses.Include(c => c.User).FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
            {
                return NotFound(new { Message = "Course not found." });
            }

            var courseDto = new CourseDto
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CourseCode = course.CourseCode,
                InstructorName = course.InstructorName,
                Credits = course.Credits,
                TargetGrade = course.TargetGrade,
                Semester = course.Semester,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                SyllabusURL = course.SyllabusURL,
                Notes = course.Notes,
                UserID = course.UserID
            };

            return Ok(courseDto);
        }

        // POST: api/Course
        [HttpPost]
        public async Task<ActionResult<CourseDto>> PostCourse([FromBody] CreateCourseDto createCourseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(createCourseDto.UserID);
            if (user == null)
            {
                return BadRequest(new { Message = "User not found." });
            }

            var course = new Course
            {
                CourseName = createCourseDto.CourseName,
                CourseCode = createCourseDto.CourseCode,
                InstructorName = createCourseDto.InstructorName,
                Credits = createCourseDto.Credits,
                TargetGrade = createCourseDto.TargetGrade,
                Semester = createCourseDto.Semester,
                StartDate = createCourseDto.StartDate,
                EndDate = createCourseDto.EndDate,
                SyllabusURL = createCourseDto.SyllabusURL,
                Notes = createCourseDto.Notes,
                UserID = createCourseDto.UserID,
                User = user,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var courseDto = new CourseDto
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CourseCode = course.CourseCode,
                InstructorName = course.InstructorName,
                Credits = course.Credits,
                TargetGrade = course.TargetGrade,
                Semester = course.Semester,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                SyllabusURL = course.SyllabusURL,
                Notes = course.Notes,
                UserID = course.UserID
            };

            return CreatedAtAction(nameof(GetCourse), new { id = course.CourseID }, courseDto);
        }

        // PUT: api/Course/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, [FromBody] UpdateCourseDto updateCourseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = await _context.Courses.Include(c => c.User).FirstOrDefaultAsync(c => c.CourseID == id);
            if (course == null)
            {
                return NotFound(new { Message = "Course not found." });
            }

            var user = await _userManager.FindByIdAsync(updateCourseDto.UserID);
            if (user == null)
            {
                return BadRequest(new { Message = "User not found." });
            }

            course.CourseName = updateCourseDto.CourseName;
            course.CourseCode = updateCourseDto.CourseCode;
            course.InstructorName = updateCourseDto.InstructorName;
            course.Credits = updateCourseDto.Credits;
            course.TargetGrade = updateCourseDto.TargetGrade;
            course.Semester = updateCourseDto.Semester;
            course.StartDate = updateCourseDto.StartDate;
            course.EndDate = updateCourseDto.EndDate;
            course.SyllabusURL = updateCourseDto.SyllabusURL;
            course.Notes = updateCourseDto.Notes;
            course.UserID = updateCourseDto.UserID;
            course.User = user;
            course.UpdatedAt = DateTime.UtcNow;

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                {
                    return NotFound(new { Message = "Course not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Course/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound(new { Message = "Course not found." });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.CourseID == id);
        }
    }
}
