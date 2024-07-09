using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class CreateEventDto
    {
        [Required]
        public int CourseID { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string EventType { get; set; } = string.Empty;

        [StringLength(255)]
        public string Location { get; set; } = string.Empty;

        public bool IsComplete { get; set; } = false;
    }
}