using api.Data;
using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScheduleController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Schedule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetSchedules()
        {
            var schedules = await _context.Scheduleds.Include(s => s.Event).ToListAsync();
            var scheduleDtos = schedules.Select(s => new ScheduleDto
            {
                ScheduledID = s.ScheduledID,
                EventID = s.EventID,
                StartTime = s.StartTime,
                EndTime = s.EndTime
            }).ToList();

            return Ok(scheduleDtos);
        }

        // GET: api/Schedule/Event/{eventId}
        [HttpGet("Event/{eventId}")]
        public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetEventSchedules(int eventId)
        {
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity == null)
            {
                return NotFound(new { Message = "Event not found." });
            }

            var schedules = await _context.Scheduleds.Where(s => s.EventID == eventId).Include(s => s.Event).ToListAsync();
            var scheduleDtos = schedules.Select(s => new ScheduleDto
            {
                ScheduledID = s.ScheduledID,
                EventID = s.EventID,
                StartTime = s.StartTime,
                EndTime = s.EndTime
            }).ToList();

            return Ok(scheduleDtos);
        }

        // GET: api/Schedule/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleDto>> GetSchedule(int id)
        {
            var schedule = await _context.Scheduleds.Include(s => s.Event).FirstOrDefaultAsync(s => s.ScheduledID == id);

            if (schedule == null)
            {
                return NotFound(new { Message = "Schedule not found." });
            }

            var scheduleDto = new ScheduleDto
            {
                ScheduledID = schedule.ScheduledID,
                EventID = schedule.EventID,
                StartTime = schedule.StartTime,
                EndTime = schedule.EndTime
            };

            return Ok(scheduleDto);
        }

        // POST: api/Schedule
        [HttpPost]
        public async Task<ActionResult<ScheduleDto>> PostSchedule([FromBody] CreateScheduleDto createScheduleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventEntity = await _context.Events.FindAsync(createScheduleDto.EventID);
            if (eventEntity == null)
            {
                return BadRequest(new { Message = "Event not found." });
            }

            var schedule = new Scheduled
            {
                EventID = createScheduleDto.EventID,
                Event = eventEntity,
                StartTime = createScheduleDto.StartTime,
                EndTime = createScheduleDto.EndTime
            };

            _context.Scheduleds.Add(schedule);
            await _context.SaveChangesAsync();

            var scheduleDto = new ScheduleDto
            {
                ScheduledID = schedule.ScheduledID,
                EventID = schedule.EventID,
                StartTime = schedule.StartTime,
                EndTime = schedule.EndTime
            };

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.ScheduledID }, scheduleDto);
        }

        // PUT: api/Schedule/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedule(int id, [FromBody] UpdateScheduleDto updateScheduleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = await _context.Scheduleds.Include(s => s.Event).FirstOrDefaultAsync(s => s.ScheduledID == id);
            if (schedule == null)
            {
                return NotFound(new { Message = "Schedule not found." });
            }

            schedule.StartTime = updateScheduleDto.StartTime;
            schedule.EndTime = updateScheduleDto.EndTime;

            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
                {
                    return NotFound(new { Message = "Schedule not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Schedule/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Scheduleds.FindAsync(id);
            if (schedule == null)
            {
                return NotFound(new { Message = "Schedule not found." });
            }

            _context.Scheduleds.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(int id)
        {
            return _context.Scheduleds.Any(s => s.ScheduledID == id);
        }
    }
}
