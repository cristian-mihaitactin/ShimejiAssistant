using Barn.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Entities.Plugins
{
    public  class UserPreferencesPlugins
    {
        public Guid UserPreferenceId { get; set; }
        public UserPreferences UserPreference { get; set; }

        public Guid PluginId { get; set; }
        public Plugin Plugin { get; set; }

    }
}
