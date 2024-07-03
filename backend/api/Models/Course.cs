namespace api.Models
{
    public class Course
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string InstructorName { get; set; } = string.Empty;
        public int Credits { get; set; }
        public decimal TargetGrade { get; set; }
        public string Semester { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string SyllabusURL { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public required string UserID { get; set; }
        public required AppUser User { get; set; }
        public ICollection<Event>? Events { get; set; }
    }
}
