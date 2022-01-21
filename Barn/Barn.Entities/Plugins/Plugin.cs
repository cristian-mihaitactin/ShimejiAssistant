using System;
using System.Collections.Generic;
using System.Text;

namespace Barn.Entities.Plugins
{
    public class Plugin: EntityWithRowVersion
    {
        public Guid Id { get; set; }
        public IList<PluginNotification> PluginNotifications { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Version { get; set; }

        public IList<UserPreferencesPlugins> UserPreferencesPlugins { get; set; }
    }
}
