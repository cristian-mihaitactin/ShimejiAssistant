using Barn.Entities.Plugins;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.Plugins
{
    public class PluginService : IPluginService
    {
        private IGenericRepo<Guid, Plugin> _pluginRepo;
        private IGenericRepo<Guid, PluginNotification> _pluginNotificationRepo;

        public PluginService(IGenericRepo<Guid, Plugin> pluginRepo,
            IGenericRepo<Guid, PluginNotification> pluginNotificationRepo)
        {
            _pluginRepo = pluginRepo;
            _pluginNotificationRepo = pluginNotificationRepo;
        }

        public Plugin GetPlugin(Guid id)
        {
            return _pluginRepo.GetById(id);
        }

        public IList<Plugin> GetPlugins()
        {
            return _pluginRepo.GetAll().ToList();
        }

        public void UpdatePlugin(Plugin plugin)
        {
            throw new NotImplementedException();
        }

        public void DeletePlugin(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
