namespace api.Dtos.Course
{
    public class CourseDto
    {
        public int CourseID { get; set; }
        public string? CourseName { get; set; }
        public string? CourseCode { get; set; }
        public string? InstructorName { get; set; }
        public int Credits { get; set; }
        public decimal TargetGrade { get; set; }
        public string? Semester { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? SyllabusURL { get; set; }
        public string? Notes { get; set; }
        public string? UserID { get; set; }
    }
}