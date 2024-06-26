﻿using Barn.Entities.Plugins;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.Plugins
{
    public interface IPluginService
    {
        IList<Plugin> GetPlugins();
        Task<Plugin> GetPlugin(Guid id);
        Task<PluginPackageDTO> GetPluginPackageAsync(Guid id);
        Task<PluginDTO> GetPluginWithImagesAsync(Guid id);
        Task UpdatePlugin(Plugin plugin);
        Task DeletePlugin(Guid id);
    }
}
