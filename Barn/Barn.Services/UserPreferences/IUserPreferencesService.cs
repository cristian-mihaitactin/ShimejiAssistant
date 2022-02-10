using System;
using System.Threading.Tasks;

namespace Barn.Services.UserPreferences
{
    public interface IUserPreferencesService
    {
        Task<Entities.Users.UserPreferences> GetUserPreferenceById(Guid id);
        
        Entities.Users.UserPreferences GetUserPreferenceByUserId(Guid userId);
        Task<bool> CreateUserPreference(Entities.Users.UserPreferences userPref);
        Task<bool> UpdateUserPreference(Entities.Users.UserPreferences userPref);
        Task InstallPluginToUser(Guid userPrefId, Guid pluginId);
        Task DeleteUserPreference(Guid id);
        Task CreateDefaultUserPreference(Entities.Users.User user);
    }
}
