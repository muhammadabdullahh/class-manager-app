namespace api.Models
{
    public class Scheduled
    {
        public int ScheduledID { get; set; }
        public int EventID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required Event Event { get; set; }
    }
}