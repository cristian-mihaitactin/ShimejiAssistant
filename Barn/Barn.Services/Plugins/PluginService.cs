using Barn.AzIntegration.Plugin;
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

        private PluginClient _pluginClient;


        public PluginService(IGenericRepo<Guid, Plugin> pluginRepo,
            IGenericRepo<Guid, PluginNotification> pluginNotificationRepo)
        {
            _pluginRepo = pluginRepo;
            _pluginNotificationRepo = pluginNotificationRepo;

            _pluginClient = new PluginClient("UseDevelopmentStorage=true");
        }

        public Plugin GetPlugin(Guid id)
        {
            return _pluginRepo.GetById(id);
        }
        public async Task<PluginPackageDTO> GetPluginPackageAsync(Guid id)
        {
            var plugin = _pluginRepo.GetById(id);
            var pluginBytes = await _pluginClient.GetPluginPackageBlob(plugin);

            return new PluginPackageDTO
            {
                FileName = plugin.Name + ".zip",
                ZipBytes = pluginBytes.ZipBytes,
                Version = plugin.Version,
                Name = plugin.Name
            };
        }

        public async Task<PluginDTO> GetPluginWithImagesAsync(Guid id)
        {
            var plugin = _pluginRepo.GetById(id);
            var pluginImageBlob = await _pluginClient.GetPluginImagesBlob(plugin);

            return new PluginDTO
            {
                Id = plugin.Id,
                Description = plugin.Description,
                Name = plugin.Name,
                Version = plugin.Version,
                PluginImageBlob = pluginImageBlob
            };
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
