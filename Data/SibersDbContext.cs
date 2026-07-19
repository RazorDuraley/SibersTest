using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SibersTest.Models;

namespace SibersTest.Data;

public class SibersDbContext : IdentityDbContext<User>
{
    public SibersDbContext(DbContextOptions<SibersDbContext> options) : base(options) { }

    public DbSet<Project> Projects { get; set; }
    public DbSet<Worker> Workers { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<ProjectFile> ProjectFiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>()
            .HasOne(p => p.ProjectManager)
            .WithMany(w => w.ManagedProjects)
            .HasForeignKey(p => p.ProjectManagerId)
            .OnDelete(DeleteBehavior.Restrict);

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
            .HasMany(p => p.Executors)
            .WithMany(w => w.Projects)
            .UsingEntity(j => j.ToTable("ProjectExecutors"));

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany()
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Author)
            .WithMany()
            .HasForeignKey(t => t.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Executor)
            .WithMany()
            .HasForeignKey(t => t.ExecutorId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ProjectFile>()
        .HasOne(pf => pf.Project)
        .WithMany(p => p.Files)
        .HasForeignKey(pf => pf.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}