using Barn.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using Barn.Entities.Users;

namespace Barn.Data.EF
{
    public class ApplicationDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        // a Db set is where we tell entity framework where to map a class (entity) to a table
        public DbSet<User> Users { get; set; }
        public DbSet<UserPreferences> UsersPreferences { get; set; }
        public DbSet<BuckyProfile> BuckyProfiles { get; set; }
        public DbSet<BuckyBehaviour> BuckyBehaviours{ get; set; }

        // This is the run time configuration of 
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        // ModelBuilder is the fluent mapping 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // [User] mapping
            modelBuilder.Entity<User>()
                .Property(u => u.RowVersion)
                .IsRowVersion(); // Cuncurrency property using fluent mapping
            modelBuilder.Entity<User>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<User>().Property(x => x.Id).HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<User>().ToTable("Users");

            // [UserPreferences] mapping
            modelBuilder.Entity<UserPreferences>()
                .Property(a => a.RowVersion)
                .IsRowVersion();

            modelBuilder.Entity<UserPreferences>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<UserPreferences>()
                .HasOne(up => up.User)
                .WithOne(u => u.UserPreferences)
                .HasForeignKey<UserPreferences>(u => u.UserId);

            modelBuilder.Entity<UserPreferences>().ToTable("UserPreferences");

            // [Bucky Profile]
            // Seeding
            Seed(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }

        public void Seed(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(u =>
            {
                u.HasData(new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserName = "Dave Coffee",
                    Email = "dave.test@test.com"
                });
            });

            modelBuilder.Entity<UserPreferences>(up =>
            {
                up.HasData(new UserPreferences
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    UserId = Guid.Parse("11111111-1111-1111-1111-111111111111")
                });
            });
        }
    }
}
