using Barn.Data.EF;
using Barn.Data.EF.Repoes;
using Barn.Entities.Plugins;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Barn.Tests.Data
{
    public class PluginRepoShould
    {
        private PluginRepo _pluginRepo;
        private static ApplicationDbContext _context = null;


        private static Guid buckyId1 = Guid.NewGuid();
        private static Guid buckyId2 = Guid.NewGuid();
        private static Guid buckyId3 = Guid.NewGuid();

        private static Guid pluginId = Guid.NewGuid();

        private static List<PluginNotification> _pluginNotificationList = new List<PluginNotification>(new PluginNotification[] {
            new PluginNotification()
            {
                Id = buckyId1,
                ActionType = Entities.Bucky.ActionType.Standby,
                Message = "I am here",
                PluginId = pluginId
            },
            new PluginNotification()
            {
                Id = buckyId2,
                ActionType = Entities.Bucky.ActionType.Notification,
                Message = "NOTIF!",
                PluginId = pluginId
            },
            new PluginNotification()
            {
                Id = buckyId3,
                ActionType = Entities.Bucky.ActionType.Attention,
                Message = "Attention!!!",
                PluginId = pluginId
            },
        });

        private static Plugin _plugin = new Plugin()
        {
            Id = pluginId,
            Name = "Test Plugin",
            Description = "This is a test plugin",
            PluginNotifications = _pluginNotificationList
        };


        private static ApplicationDbContext DbContext
        {
            get
            {
                if (_context == null)
                {
                    var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseInMemoryDatabase("Bucky-test-plugins");

                    _context = new ApplicationDbContext(builder.Options);

                    _context.Plugins.Add(_plugin);
                    int changed = _context.SaveChanges();

                    _context.SaveChanges();
                }

                return _context;
            }
        }

        public PluginRepoShould()
        {
            _pluginRepo = new PluginRepo(DbContext);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnAllPlugin()
        {
            //Arrange

            //Act
            var result = _pluginRepo.GetAll();

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task InsertPlugin()
        {
            //Arrange
            var pluginId = Guid.NewGuid();

            var plugin = new Plugin()
            {
                Id = pluginId,
                Name = "Test Plugin",
                Description = "This is a test plugin",
                PluginNotifications = null
            };

            //Act
            var result = await _pluginRepo.InsertAsync(plugin);

            //Assert
            var pluginNotificationListResult = _pluginRepo.GetAll();
            var buckyFound = await _pluginRepo.GetAsyncById(pluginId);

            result.ShouldBeTrue();
            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldContain(plugin);
            Assert.True(buckyFound.Id == pluginId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task ReturnPluginFoGivenId()
        {
            //Arrange
            var pluginId = Guid.NewGuid();

            var plugin = new Plugin()
            {
                Id = pluginId,
                Name = "Test Plugin to Insert",
                Description = "This is a insertable plugin",
                PluginNotifications = null
            };

                await _pluginRepo.InsertAsync(plugin);

            //Act
            var result = await _pluginRepo.GetAsyncById(pluginId);

            //Assert
            result.ShouldNotBeNull();
            Assert.True(result.Id == pluginId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task ReturnNullForUnknownId()
        {
            //Arrange
            var pluginId = Guid.NewGuid();

            //Act
            var result = await _pluginRepo.GetAsyncById(pluginId);

            //Assert
            result.ShouldBeNull();
        }


        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task UpdatePluginForProvidedPlugin()
        {
            //Arrange
            var pluginId = Guid.NewGuid();


            var plugin = new Plugin()
            {
                Id = pluginId,
                Name = "Test Plugin",
                Description = "This is a test plugin",
                PluginNotifications = null
            };

            await _pluginRepo.InsertAsync(plugin);

            var pluginNotification = new PluginNotification()
            {
                Id = Guid.Empty,
                ActionType = Entities.Bucky.ActionType.Standby,
                Message = "I am new"
            };

            plugin.PluginNotifications = new List<PluginNotification>(new PluginNotification[]
            {
                pluginNotification
            });
            //Act
            var result = await _pluginRepo.UpdateAsync(plugin);

            //Assert
            var pluginListResult = _pluginRepo.GetAll();
            var pluginnResult = await _pluginRepo.GetAsyncById(pluginId);

            result.ShouldBeTrue();
            pluginListResult.ShouldNotBeNull();
            pluginListResult.ShouldContain(plugin);
            Assert.True(pluginnResult.Id == pluginId);

            pluginnResult.PluginNotifications.ShouldNotBeNull();
            pluginnResult.PluginNotifications.ShouldContain(pluginNotification); ;
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task NotUpdatePluginFoUnknownPlugin()
        {
            //Arrange
            var pluginId = Guid.NewGuid();

            var plugin = new Plugin()
            {
                Id = pluginId,
                Name = "Unknown Test Plugin",
                Description = "This is a test plugin that doesn't exist",
                PluginNotifications = null
            };

            //Act
            var result = await _pluginRepo.UpdateAsync(plugin);

            //Assert
            var pluginNotificationListResult = _pluginRepo.GetAll();
            var buckyFound = await _pluginRepo.GetAsyncById(pluginId);

            result.ShouldBeFalse();
            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldNotContain(plugin);
            buckyFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task DeletePluginWithProvidedID()
        {
            //Arrange
            var pluginId = Guid.NewGuid();

            var plugin = new Plugin()
            {
                Id = pluginId,
                Name = "Test Plugin",
                Description = "This is a test plugin",
                PluginNotifications = null
            };

            await _pluginRepo.InsertAsync(plugin);

            //Act
            await _pluginRepo.DeleteAsync(pluginId);

            //Assert
            var pluginNotificationListResult = _pluginRepo.GetAll();
            var buckyFound = await _pluginRepo.GetAsyncById(pluginId);

            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldNotContain(plugin);
            buckyFound.ShouldBeNull();
        }
    }
}
