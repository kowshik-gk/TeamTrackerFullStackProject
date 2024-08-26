using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Models;

namespace ProjectManagementTool.Context
{
    public class MySqlDbContext : DbContext
    {
        public MySqlDbContext(DbContextOptions<MySqlDbContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Manager> Manager { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Tasks> Task { get; set; }
        public DbSet<TeamLeader> TeamLeader { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeName)
                .IsUnique();

            modelBuilder.Entity<Manager>()
               .HasIndex(m => m.ManagerName)
               .IsUnique();

            modelBuilder.Entity<TeamLeader>()
                .HasIndex(tl => tl.TeamLeaderName)
                .IsUnique();

            modelBuilder.Entity<Project>()
           .HasIndex(p => p.Name)
           .IsUnique();

            modelBuilder.Entity<Tasks>()
           .HasIndex(p => p.TaskName)
           .IsUnique();

            base.OnModelCreating(modelBuilder);
        }



    }
}
