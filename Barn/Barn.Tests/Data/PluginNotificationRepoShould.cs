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
    public class PluginNotificationRepoShould
    {
        private PluginNotificationRepo _pluginNotificationRepo;
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
                    .UseInMemoryDatabase("Bucky-test-pluginNotifications");

                    _context = new ApplicationDbContext(builder.Options);

                    _context.Plugins.Add(_plugin);
                    int changed = _context.SaveChanges();

                    //_context.PluginNotifications.AddRange(_pluginNotificationList);
                    _context.SaveChanges();
                }

                return _context;
            }
        }

        public PluginNotificationRepoShould()
        {
            _pluginNotificationRepo = new PluginNotificationRepo(DbContext);
        }

        [Fact]
        [Trait("Category", "Unit")]
        public void ReturnAllPluginNotification()
        {
            //Arrange

            //Act
            var result = _pluginNotificationRepo.GetAll();

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        [Trait("Category", "Unit")]
        public async Task InsertPluginNotification()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            var pluginNotification = new PluginNotification()
            {
                Id = pluginNotificationId,
                ActionType = Entities.Bucky.ActionType.Bow,
                Message = "I am bow",
                PluginId = pluginId
            };

            //Act
            var result = await _pluginNotificationRepo.InsertAsync(pluginNotification);

            //Assert
            var pluginNotificationListResult = _pluginNotificationRepo.GetAll();
            var buckyFound = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            result.ShouldBeTrue();
            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldContain(pluginNotification);
            Assert.True(buckyFound.Id == pluginNotificationId);
        }

        [Fact]
        [Trait("Category", "Unit")]
        public async Task ReturnPluginNotificationFoGivenId()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            var pluginNotification = new PluginNotification()
            {
                Id = pluginNotificationId,
                ActionType = Entities.Bucky.ActionType.Dragged,
                Message = "I am beeing dragged",
                PluginId = pluginId
            };

            await _pluginNotificationRepo.InsertAsync(pluginNotification);

            //Act
            var result = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            //Assert
            result.ShouldNotBeNull();
            Assert.True(result.Id == pluginNotificationId);
        }

        [Fact]
        [Trait("Category", "Unit")]
        public async Task ReturnNullForUnknownId()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            //Act
            var result = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            //Assert
            result.ShouldBeNull();
        }


        [Fact]
        [Trait("Category", "Unit")]
        public async Task UpdatePluginNotificationForProvidedPluginNotification()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            var pluginNotification = new PluginNotification()
            {
                Id = pluginNotificationId,
                ActionType = Entities.Bucky.ActionType.Notification,
                Message = "I am notification",
                PluginId = pluginId
            };

            await _pluginNotificationRepo.InsertAsync(pluginNotification);

            pluginNotification.ActionType = Entities.Bucky.ActionType.Attention;
            pluginNotification.Message = "I AM ATTENTION!!";
            //Act
            var result = await _pluginNotificationRepo.UpdateAsync(pluginNotification);

            //Assert
            var pluginNotificationListResult = _pluginNotificationRepo.GetAll();
            var pluginNotificationResult = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            result.ShouldBeTrue();
            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldContain(pluginNotification);
            Assert.True(pluginNotificationResult.Id == pluginNotificationId);
            Assert.True(pluginNotificationResult.ActionType == Entities.Bucky.ActionType.Attention);
            Assert.True(pluginNotificationResult.Message == "I AM ATTENTION!!");
        }

        [Fact]
        [Trait("Category", "Unit")]
        public async Task NotUpdatePluginNotificationFoUnknownPluginNotification()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            var pluginNotification = new PluginNotification()
            {
                Id = pluginNotificationId,
                ActionType = Entities.Bucky.ActionType.Notification,
                Message = "I am notification",
                PluginId = pluginId
            };

            //Act
            var result = await _pluginNotificationRepo.UpdateAsync(pluginNotification);

            //Assert
            var pluginNotificationListResult = _pluginNotificationRepo.GetAll();
            var buckyFound = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            result.ShouldBeFalse();
            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldNotContain(pluginNotification);
            buckyFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "Unit")]
        public async Task DeletePluginNotificationWithProvidedID()
        {
            //Arrange
            var pluginNotificationId = Guid.NewGuid();

            var pluginNotification = new PluginNotification()
            {
                Id = pluginNotificationId,
                ActionType = Entities.Bucky.ActionType.Notification,
                Message = "I am notification to be deleted",
                PluginId = pluginId
            };

            await _pluginNotificationRepo.InsertAsync(pluginNotification);

            //Act
            await _pluginNotificationRepo.DeleteAsync(pluginNotificationId);

            //Assert
            var pluginNotificationListResult = _pluginNotificationRepo.GetAll();
            var buckyFound = await _pluginNotificationRepo.GetAsyncById(pluginNotificationId);

            pluginNotificationListResult.ShouldNotBeNull();
            pluginNotificationListResult.ShouldNotContain(pluginNotification);
            buckyFound.ShouldBeNull();
        }
    }
}
