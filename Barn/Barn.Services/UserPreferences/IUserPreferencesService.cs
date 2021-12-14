using System;

namespace Barn.Services.UserPreferences
{
    public interface IUserPreferencesService
    {
        Entities.Users.UserPreferences GetUserPreferenceById(Guid id);
        
        Entities.Users.UserPreferences GetUserPreferenceByUserId(Guid userId);
        bool CreateUserPreference(Entities.Users.UserPreferences userPref);
        bool UpdateUserPreference(Entities.Users.UserPreferences userPref);
        bool DeleteUserPreference(Guid id);
    }
}
