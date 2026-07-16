using Microsoft.EntityFrameworkCore;
using SibersTest.Models;



namespace SibersTest.Data
{
    public class SibersDbContext : DbContext
    {
        // 1. Этот конструктор принимает настройки от Program.cs
        public SibersDbContext(DbContextOptions<SibersDbContext> options) : base(options) // 2. Передаёт их в базовый класс DbContext
        {

        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<ExecutorCompany> ExCompanies { get; set; }
        public DbSet<CustomerCompany> CusCompanies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>()
                .HasOne(p => p.CustomerCompany)
                .WithMany()
                .HasForeignKey(p => p.CustomerCompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ExecutorCompany)
                .WithMany()
                .HasForeignKey(p => p.ExecutorCompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectManager)
                .WithMany(w => w.ManagedProjects)
                .HasForeignKey(p => p.ProjectManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Executors)
                .WithMany(w => w.Projects)
                .UsingEntity(j => j.ToTable("ProjectExecutors"));
        }
    }
}
