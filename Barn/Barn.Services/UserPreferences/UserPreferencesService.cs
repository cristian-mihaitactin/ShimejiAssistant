using Barn.Entities.Plugins;
using Barn.Services.BuckyProfile;
using Barn.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Barn.Services.UserPreferences
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private IGenericRepo<Guid, Entities.Users.UserPreferences> _userPrefRepo;
        private IGenericRepo<Tuple<Guid, Guid>, UserPreferencesPlugins> _userPrefPluginsRepo;
        private IBuckyProfileService _buckyProfService;

        public UserPreferencesService(IGenericRepo<Guid, Entities.Users.UserPreferences> userPrefRepo,
            IGenericRepo<Tuple<Guid, Guid>, UserPreferencesPlugins> userPrefPluginsRepo,
            IBuckyProfileService buckyProfileService)
        {
            _userPrefRepo = userPrefRepo;
            _buckyProfService = buckyProfileService;
            _userPrefPluginsRepo = userPrefPluginsRepo;
        }

        public async Task CreateDefaultUserPreference(Entities.Users.User user)
        {
            var newUserPref = new Entities.Users.UserPreferences();
            newUserPref.User = user;
            newUserPref.BuckyProfileID = _buckyProfService.GetDefaultProfile().Id;

            await this.CreateUserPreference(newUserPref);
        }
        public async Task<bool> CreateUserPreference(Entities.Users.UserPreferences userPref)
        {
            return await _userPrefRepo.InsertAsync(userPref);
        }

        public async Task<Entities.Users.UserPreferences> GetUserPreferenceById(Guid id)
        {
            return await _userPrefRepo.GetAsyncById(id);
        }

        public Entities.Users.UserPreferences GetUserPreferenceByUserId(Guid userId)
        {
            return _userPrefRepo.GetAll().Where(up => up.UserId == userId).FirstOrDefault();
        }

        public async Task InstallPluginToUser(Guid userPrefId, Guid pluginId)
        {
            await _userPrefPluginsRepo.InsertAsync(new UserPreferencesPlugins()
            {
                PluginId = pluginId,
                UserPreferenceId = userPrefId
            });
        }

        public async Task<bool> UpdateUserPreference(Entities.Users.UserPreferences userPref)
        {
            return await _userPrefRepo.UpdateAsync(userPref);
        }

        public async Task DeleteUserPreference(Guid id)
        {
            await _userPrefRepo.DeleteAsync(id);
        }
    }
}
