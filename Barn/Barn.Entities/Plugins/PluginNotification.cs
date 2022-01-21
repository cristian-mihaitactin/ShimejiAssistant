using System;
using Barn.Entities.Bucky;

namespace Barn.Entities.Plugins
{
    public class PluginNotification : EntityWithRowVersion
    {
        public Guid Id { get; set; }
        public ActionType ActionType { get; set; }
        public string Message { get; set; }
        public Guid PluginId { get; set; }
        public Plugin Plugin { get; set; }
    }
}
