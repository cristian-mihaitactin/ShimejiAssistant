using Barn.AzIntegration.Plugin;
using Barn.Entities.Plugins;
using Barn.Services.Interfaces;
using Microsoft.Extensions.Configuration;
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
        private IConfiguration _configuration;

        private PluginClient _pluginClient;


        public PluginService(IGenericRepo<Guid, Plugin> pluginRepo,
            IGenericRepo<Guid, PluginNotification> pluginNotificationRepo, IConfiguration configuration)
        {
            _configuration = configuration;
            _pluginRepo = pluginRepo;
            _pluginNotificationRepo = pluginNotificationRepo;

            _pluginClient = new PluginClient(_configuration.GetConnectionString("AzStorageConnectionString"));
        }

        public async Task<Plugin> GetPlugin(Guid id)
        {
            return await _pluginRepo.GetAsyncById(id);
        }

        public async Task<PluginPackageDTO> GetPluginPackageAsync(Guid id)
        {
            var plugin = await _pluginRepo.GetAsyncById(id);
            var pluginBytes = await _pluginClient.GetPluginPackageBlob(plugin);
            var pluginImageBlob = await _pluginClient.GetPluginImagesBlob(plugin);

            return new PluginPackageDTO
            {
                FileName = plugin.Version + ".zip",
                ZipBytes = pluginBytes.ZipBytes,
                Version = plugin.Version,
                Name = plugin.Name,
                PluginImagesBlob = pluginImageBlob
            };
        }

        public async Task<PluginDTO> GetPluginWithImagesAsync(Guid id)
        {
            var plugin = await _pluginRepo.GetAsyncById(id);
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

        public async Task UpdatePlugin(Plugin plugin)
        {
            await _pluginRepo.UpdateAsync(plugin);
        }

        public async Task DeletePlugin(Guid id)
        {
            await _pluginRepo.DeleteAsync(id);
        }

    }
}
