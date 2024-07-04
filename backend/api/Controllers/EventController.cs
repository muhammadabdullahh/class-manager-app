using api.Data;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _context.Events.Include(e => e.Course).ToListAsync();
            var eventDtos = events.Select(e => new EventDto
            {
                EventID = e.EventID,
                CourseID = e.CourseID,
                Title = e.Title,
                Description = e.Description,
                EventType = e.EventType,
                Status = e.Status,
                Location = e.Location,
                IsComplete = e.IsComplete,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            }).ToList();

            return Ok(eventDtos);
        }

        [HttpGet("Course/{courseId}")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetCourseEvents(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return NotFound(new { Message = "Course not found." });
            }

            var events = await _context.Events.Where(e => e.CourseID == courseId).Include(e => e.Course).ToListAsync();
            var eventDtos = events.Select(e => new EventDto
            {
                EventID = e.EventID,
                CourseID = e.CourseID,
                Title = e.Title,
                Description = e.Description,
                EventType = e.EventType,
                Status = e.Status,
                Location = e.Location,
                IsComplete = e.IsComplete,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            }).ToList();

            return Ok(eventDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventEntity = await _context.Events.Include(e => e.Course).FirstOrDefaultAsync(e => e.EventID == id);

            if (eventEntity == null)
            {
                return NotFound(new { Message = "Event not found." });
            }

            var eventDto = new EventDto
            {
                EventID = eventEntity.EventID,
                CourseID = eventEntity.CourseID,
                Title = eventEntity.Title,
                Description = eventEntity.Description,
                EventType = eventEntity.EventType,
                Status = eventEntity.Status,
                Location = eventEntity.Location,
                IsComplete = eventEntity.IsComplete,
                CreatedAt = eventEntity.CreatedAt,
                UpdatedAt = eventEntity.UpdatedAt
            };

            return Ok(eventDto);
        }

        [HttpPost]
        public async Task<ActionResult<EventDto>> PostEvent([FromBody] CreateEventDto createEventDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = await _context.Courses.FindAsync(createEventDto.CourseID);
            if (course == null)
            {
                return BadRequest(new { Message = "Course not found." });
            }

            var eventEntity = new Event
            {
                CourseID = createEventDto.CourseID,
                Course = course,
                Title = createEventDto.Title,
                Description = createEventDto.Description,
                EventType = createEventDto.EventType,
                Status = createEventDto.Status,
                Location = createEventDto.Location,
                IsComplete = createEventDto.IsComplete,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Events.Add(eventEntity);
            await _context.SaveChangesAsync();

            var eventDto = new EventDto
            {
                EventID = eventEntity.EventID,
                CourseID = eventEntity.CourseID,
                Title = eventEntity.Title,
                Description = eventEntity.Description,
                EventType = eventEntity.EventType,
                Status = eventEntity.Status,
                Location = eventEntity.Location,
                IsComplete = eventEntity.IsComplete,
                CreatedAt = eventEntity.CreatedAt,
                UpdatedAt = eventEntity.UpdatedAt
            };

            return CreatedAtAction(nameof(GetEvent), new { id = eventEntity.EventID }, eventDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, [FromBody] UpdateEventDto updateEventDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventEntity = await _context.Events.Include(e => e.Course).FirstOrDefaultAsync(e => e.EventID == id);
            if (eventEntity == null)
            {
                return NotFound(new { Message = "Event not found." });
            }

            var course = await _context.Courses.FindAsync(eventEntity.CourseID);
            if (course == null)
            {
                return BadRequest(new { Message = "Course not found." });
            }

            eventEntity.Title = updateEventDto.Title;
            eventEntity.Description = updateEventDto.Description;
            eventEntity.EventType = updateEventDto.EventType;
            eventEntity.Status = updateEventDto.Status;
            eventEntity.Location = updateEventDto.Location;
            eventEntity.IsComplete = updateEventDto.IsComplete;
            eventEntity.Course = course;
            eventEntity.UpdatedAt = DateTime.UtcNow;

            _context.Entry(eventEntity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound(new { Message = "Event not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity == null)
            {
                return NotFound(new { Message = "Event not found." });
            }

            _context.Events.Remove(eventEntity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.EventID == id);
        }
    }
}
