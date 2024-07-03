namespace api.Models
{
    public class Weighted
    {
        public int WeightedID { get; set; }
        public int EventID { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime SubmissionDate { get; set; }
        public decimal MaxScore { get; set; }
        public decimal ScoreAchieved { get; set; }
        public decimal Weight { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required Event Event { get; set; }
    }
}