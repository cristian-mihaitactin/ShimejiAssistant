using Barn.Entities.Users;
using System;

namespace Barn.API.Models
{
    public class UserPreferencesModel
    {
        public Guid? Id { get; set; }
        public Guid? UserId { get; set; }
        public Guid BuckyProfileID { get; set; }

        public UserPreferencesModel()
        {

        }
        public UserPreferencesModel(UserPreferences userPreference)
        {
            Id = userPreference.Id;
            UserId = userPreference.UserId;
            BuckyProfileID = userPreference.BuckyProfileID;
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
