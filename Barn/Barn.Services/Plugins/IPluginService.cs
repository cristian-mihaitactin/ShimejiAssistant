using Barn.Entities.Plugins;
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
        Plugin GetPlugin(Guid id);
        void UpdatePlugin(Plugin plugin);
        void DeletePlugin(Guid id);
    }
}
