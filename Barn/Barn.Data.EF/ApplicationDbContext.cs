using Barn.Data.EF.DTOs;
using Microsoft.EntityFrameworkCore;
using System;

namespace Barn.Data.EF
{
    public class ApplicationDbContext: DbContext
    {
        // a Db set is where we tell entity framework where to map a class (entity) to a table
        public DbSet<UserDTO> Users { get; set; }
        public DbSet<UserPreferencesDTO> UsersPreferences { get; set; }

        // This is the run time configuration of 
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        // ModelBuilder is the fluent mapping 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // [User] mapping
            modelBuilder.Entity<UserDTO>()
                .Property(u => u.RowVersion)
                .IsRowVersion(); // Cuncurrency property using fluent mapping
            modelBuilder.Entity<UserDTO>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<UserDTO>().Property(x => x.Id).HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<UserDTO>().ToTable("Users");

            // [UserPreferences] mapping
            modelBuilder.Entity<UserPreferencesDTO>()
                .Property(a => a.RowVersion)
                .IsRowVersion();

            modelBuilder.Entity<UserPreferencesDTO>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<UserPreferencesDTO>()
                .HasOne(up => up.User)
                .WithOne(u => u.UserPreferences)
                .HasForeignKey<UserPreferencesDTO>(u => u.UserId);

            modelBuilder.Entity<UserPreferencesDTO>().ToTable("UserPreferences");

            // Seeding
            modelBuilder.Entity<UserDTO>(u =>
            {
                u.HasData(new UserDTO
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserName = "Dave Coffee",
                    Email = "dave.test@test.com"
                });
            });

            modelBuilder.Entity<UserPreferencesDTO>( up =>
            {
                up.HasData(new UserPreferencesDTO
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    UserId = Guid.Parse("11111111-1111-1111-1111-111111111111")
                });
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
