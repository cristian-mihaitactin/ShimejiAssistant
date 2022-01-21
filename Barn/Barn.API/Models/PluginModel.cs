using Barn.Entities.Plugins;
using System;
using System.Collections.Generic;

namespace Barn.API.Models
{
    public class PluginModel
    {
        public Guid Id { get; set; }
        // public IList<PluginNotification> PluginNotifications { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Version { get; set; }
    }
}