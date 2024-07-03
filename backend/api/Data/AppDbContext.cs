using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Weighted> Weighteds { get; set; }
        public DbSet<Scheduled> Scheduleds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Courses table
            modelBuilder.Entity<Course>()
                .HasKey(c => c.CourseID);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.User)
                .WithMany(u => u.Courses)
                .HasForeignKey(c => c.UserID);

            modelBuilder.Entity<Course>()
                .Property(c => c.CourseName)
                .IsRequired()
                .HasMaxLength(255);

            modelBuilder.Entity<Course>()
                .Property(c => c.CourseCode)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Course>()
                .HasIndex(c => c.CourseCode)
                .IsUnique();

            // Events table
            modelBuilder.Entity<Event>()
                .HasKey(e => e.EventID);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.CourseID);

            modelBuilder.Entity<Event>()
                .Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(255);

            // Weighted table
            modelBuilder.Entity<Weighted>()
                .HasKey(w => w.WeightedID);

            modelBuilder.Entity<Weighted>()
                .HasOne(w => w.Event)
                .WithMany(e => e.Weighteds)
                .HasForeignKey(w => w.EventID);

            // Scheduled table
            modelBuilder.Entity<Scheduled>()
                .HasKey(s => s.ScheduledID);

            modelBuilder.Entity<Scheduled>()
                .HasOne(s => s.Event)
                .WithMany(e => e.Scheduleds)
                .HasForeignKey(s => s.EventID);

        }
    }
}
