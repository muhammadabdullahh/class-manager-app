namespace api.Dtos
{
    public class ScheduleDto
    {
        public int ScheduledID { get; set; }
        public int EventID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
