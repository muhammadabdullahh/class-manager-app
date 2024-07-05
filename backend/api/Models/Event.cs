namespace api.Models
{
    public class Event
    {
        public int EventID { get; set; }
        public int CourseID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public required Course Course { get; set; } 
        public ICollection<Weighted>? Weighteds { get; set; }
        public ICollection<Scheduled>? Scheduleds { get; set; }
    }
}
