using System;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class CreateWeightedDto
    {
        [Required]
        public int EventID { get; set; }

        public DateTime SubmissionDate { get; set; }

        [Range(0, 100)]
        public decimal MaxScore { get; set; } = 100;

        [Range(0, 100)]
        public decimal ScoreAchieved { get; set; } = 0;

        [Range(0, 100)]
        public decimal Weight { get; set; } = 0;

        [StringLength(500)]
        public string Feedback { get; set; } = string.Empty;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}
