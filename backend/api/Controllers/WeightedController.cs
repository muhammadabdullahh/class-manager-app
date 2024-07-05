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
    public class WeightedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WeightedController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeightedDto>>> GetWeighteds()
        {
            var weighteds = await _context.Weighteds.Include(w => w.Event).ToListAsync();
            var weightedDtos = weighteds.Select(w => new WeightedDto
            {
                WeightedID = w.WeightedID,
                EventID = w.EventID,
                SubmissionDate = w.SubmissionDate,
                MaxScore = w.MaxScore,
                ScoreAchieved = w.ScoreAchieved,
                Weight = w.Weight,
                Feedback = w.Feedback,
                StartTime = w.StartTime,
                EndTime = w.EndTime
            }).ToList();

            return Ok(weightedDtos);
        }

        [HttpGet("Event/{eventId}")]
        public async Task<ActionResult<IEnumerable<WeightedDto>>> GetEventWeighteds(int eventId)
        {
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity == null)
            {
                return NotFound(new { Message = "Event not found." });
            }

            var weighteds = await _context.Weighteds.Where(w => w.EventID == eventId).Include(w => w.Event).ToListAsync();
            var weightedDtos = weighteds.Select(w => new WeightedDto
            {
                WeightedID = w.WeightedID,
                EventID = w.EventID,
                SubmissionDate = w.SubmissionDate,
                MaxScore = w.MaxScore,
                ScoreAchieved = w.ScoreAchieved,
                Weight = w.Weight,
                Feedback = w.Feedback,
                StartTime = w.StartTime,
                EndTime = w.EndTime
            }).ToList();

            return Ok(weightedDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WeightedDto>> GetWeighted(int id)
        {
            var weighted = await _context.Weighteds.Include(w => w.Event).FirstOrDefaultAsync(w => w.WeightedID == id);

            if (weighted == null)
            {
                return NotFound(new { Message = "Weighted not found." });
            }

            var weightedDto = new WeightedDto
            {
                WeightedID = weighted.WeightedID,
                EventID = weighted.EventID,
                SubmissionDate = weighted.SubmissionDate,
                MaxScore = weighted.MaxScore,
                ScoreAchieved = weighted.ScoreAchieved,
                Weight = weighted.Weight,
                Feedback = weighted.Feedback,
                StartTime = weighted.StartTime,
                EndTime = weighted.EndTime
            };

            return Ok(weightedDto);
        }

        [HttpPost]
        public async Task<ActionResult<WeightedDto>> PostWeighted([FromBody] CreateWeightedDto createWeightedDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var eventEntity = await _context.Events.FindAsync(createWeightedDto.EventID);
            if (eventEntity == null)
            {
                return BadRequest(new { Message = "Event not found." });
            }

            var weighted = new Weighted
            {
                EventID = createWeightedDto.EventID,
                Event = eventEntity,
                SubmissionDate = createWeightedDto.SubmissionDate,
                MaxScore = createWeightedDto.MaxScore,
                ScoreAchieved = createWeightedDto.ScoreAchieved,
                Weight = createWeightedDto.Weight,
                Feedback = createWeightedDto.Feedback,
                StartTime = createWeightedDto.StartTime,
                EndTime = createWeightedDto.EndTime
            };

            _context.Weighteds.Add(weighted);
            await _context.SaveChangesAsync();

            var weightedDto = new WeightedDto
            {
                WeightedID = weighted.WeightedID,
                EventID = weighted.EventID,
                SubmissionDate = weighted.SubmissionDate,
                MaxScore = weighted.MaxScore,
                ScoreAchieved = weighted.ScoreAchieved,
                Weight = weighted.Weight,
                Feedback = weighted.Feedback,
                StartTime = weighted.StartTime,
                EndTime = weighted.EndTime
            };

            return CreatedAtAction(nameof(GetWeighted), new { id = weighted.WeightedID }, weightedDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutWeighted(int id, [FromBody] UpdateWeightedDto updateWeightedDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var weighted = await _context.Weighteds.Include(w => w.Event).FirstOrDefaultAsync(w => w.WeightedID == id);
            if (weighted == null)
            {
                return NotFound(new { Message = "Weighted not found." });
            }

            weighted.SubmissionDate = updateWeightedDto.SubmissionDate;
            weighted.MaxScore = updateWeightedDto.MaxScore;
            weighted.ScoreAchieved = updateWeightedDto.ScoreAchieved;
            weighted.Weight = updateWeightedDto.Weight;
            weighted.Feedback = updateWeightedDto.Feedback;
            weighted.StartTime = updateWeightedDto.StartTime;
            weighted.EndTime = updateWeightedDto.EndTime;

            _context.Entry(weighted).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WeightedExists(id))
                {
                    return NotFound(new { Message = "Weighted not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWeighted(int id)
        {
            var weighted = await _context.Weighteds.FindAsync(id);
            if (weighted == null)
            {
                return NotFound(new { Message = "Weighted not found." });
            }

            _context.Weighteds.Remove(weighted);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WeightedExists(int id)
        {
            return _context.Weighteds.Any(w => w.WeightedID == id);
        }
    }
}
