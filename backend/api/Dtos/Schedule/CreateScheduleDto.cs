using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class CreateScheduleDto
    {
        [Required]
        public int EventID { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}