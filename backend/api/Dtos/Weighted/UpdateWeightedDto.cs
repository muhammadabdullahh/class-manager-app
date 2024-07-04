using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class UpdateWeightedDto
    {
        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public DateTime SubmissionDate { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal MaxScore { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal ScoreAchieved { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal Weight { get; set; }

        [StringLength(500)]
        public string Feedback { get; set; } = string.Empty;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}