using Barn.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Barn.API.Models
{
    public class UserPreferencesModel
    {
        public Guid? Id { get; set; }
        public Guid? UserId { get; set; }
        public Guid BuckyProfileID { get; set; }
        public IList<PluginModel> Plugins { get; set; }

        public UserPreferencesModel()
        {

        }
        public UserPreferencesModel(UserPreferences userPreference)
        {
            Id = userPreference.Id;
            UserId = userPreference.UserId;
            BuckyProfileID = userPreference.BuckyProfileID;
            Plugins = userPreference.UserPreferencesPlugins?.Select(upp =>
            {
                var plugin = upp.Plugin;

                return new PluginModel()
                {
                    Id = plugin.Id,
                    Name = plugin.Name,
                    Description = plugin.Description,
                    Version = plugin.Version
                };
            }).ToList();
        }

        public UserPreferences ToEntity()
        {
            return new UserPreferences
            {
                Id = this.Id ?? Guid.Empty,
                UserId = this.UserId ?? Guid.Empty,
                BuckyProfileID = this.BuckyProfileID
            };
        }
    }
}
