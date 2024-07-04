using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class UpdateScheduleDto
    {
        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}