using Barn.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using Barn.Entities.Bucky;
using Barn.Entities.Users;
using Barn.Entities.Plugins;

namespace Barn.Data.EF
{
    public class ApplicationDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        // a Db set is where we tell entity framework where to map a class (entity) to a table
        public DbSet<User> Users { get; set; }
        public DbSet<UserPreferences> UsersPreferences { get; set; }
        public DbSet<BuckyProfile> BuckyProfiles { get; set; }
        public DbSet<BuckyBehaviour> BuckyBehaviours{ get; set; }
        public DbSet<Plugin> Plugins { get; set; }
        public DbSet<UserPreferencesPlugins> UserPreferencesPlugins { get; set; }
        public DbSet<PluginNotification> PluginNotifications { get; set; }

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

            // [BuckyProfile]
            modelBuilder.Entity<BuckyProfile>()
                .Property(a => a.RowVersion)
                .IsRowVersion();
            modelBuilder.Entity<BuckyProfile>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<UserPreferences>()
                .HasOne(up => up.BuckyProfile)
                .WithOne()
                .HasForeignKey<UserPreferences>(u => u.BuckyProfileID)
                .IsRequired(false);

            modelBuilder.Entity<BuckyProfile>().ToTable("BuckyProfile");

            // [BuckyBehaviour]
            modelBuilder.Entity<BuckyBehaviour>()
                .Property(a => a.RowVersion)
                .IsRowVersion();
            modelBuilder.Entity<BuckyBehaviour>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<BuckyBehaviour>()
                .HasOne(b => b.BuckyProfile)
                .WithMany(profile => profile.Behaviours)
                .HasForeignKey(a => a.BuckyProfileId);

            modelBuilder.Entity<BuckyBehaviour>().ToTable("BuckyBehaviour");

            // [Plugin]
            modelBuilder.Entity<Plugin>()
                .Property(a => a.RowVersion)
                .IsRowVersion();
            modelBuilder.Entity<Plugin>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<Plugin>().ToTable("Plugin");

            // [PluginNotification]
            modelBuilder.Entity<PluginNotification>()
                .Property(a => a.RowVersion)
                .IsRowVersion();
            modelBuilder.Entity<PluginNotification>()
                .Property(a => a.Id)
                .HasColumnType("uniqueidentifier");

            modelBuilder.Entity<PluginNotification>()
                .HasOne(b => b.Plugin)
                .WithMany(plugin => plugin.PluginNotifications)
                .HasForeignKey(a => a.PluginId);

            //UserPreferencesPlugins
            modelBuilder.Entity<UserPreferencesPlugins>().HasKey(sc => new { sc.UserPreferenceId, sc.PluginId});
            modelBuilder.Entity<UserPreferencesPlugins>()
            .HasOne<Plugin>(sc => sc.Plugin)
            .WithMany(s => s.UserPreferencesPlugins)
            .HasForeignKey(sc => sc.PluginId);


            modelBuilder.Entity<UserPreferencesPlugins>()
                .HasOne<UserPreferences>(sc => sc.UserPreference)
                .WithMany(s => s.UserPreferencesPlugins)
                .HasForeignKey(sc => sc.UserPreferenceId);

            // Seeding
            //Seed(modelBuilder);

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
