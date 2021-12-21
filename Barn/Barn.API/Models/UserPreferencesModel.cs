using Barn.Entities.Users;
using System;

namespace Barn.API.Models
{
    public class UserPreferencesModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public UserPreferencesModel(UserPreferences userPreference)
        {
            Id = userPreference.Id;
            UserId = userPreference.UserId;
        }

        public UserPreferences ToEntity()
        {
            return new UserPreferences
            {
                Id = this.Id,
                UserId = this.UserId
            };
        }
    }
}
