using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Course
{
    public class UpdateCourseDto
    {
        [Required]
        [StringLength(255)]
        public string CourseName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string CourseCode { get; set; } = string.Empty;

        [StringLength(255)]
        public string InstructorName { get; set; } = string.Empty;

        [Range(0, 10)]
        public int Credits { get; set; }

        [Range(0, 100)]
        public decimal TargetGrade { get; set; }

        [StringLength(50)]
        public string Semester { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Url]
        public string SyllabusURL { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        [Required]
        public required string UserID { get; set; }
    }
}