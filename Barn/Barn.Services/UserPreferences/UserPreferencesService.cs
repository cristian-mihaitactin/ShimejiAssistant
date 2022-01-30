using Barn.Entities.Plugins;
using Barn.Services.BuckyProfile;
using Barn.Services.Interfaces;
using System;
using System.Linq;

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

        public void CreateDefaultUserPreference(Entities.Users.User user)
        {
            var newUserPref = new Entities.Users.UserPreferences();
            newUserPref.User = user;
            newUserPref.BuckyProfileID = _buckyProfService.GetDefaultProfile().Id;

            this.CreateUserPreference(newUserPref);
        }
        public bool CreateUserPreference(Entities.Users.UserPreferences userPref)
        {
            return _userPrefRepo.Insert(userPref);
        }

        public Entities.Users.UserPreferences GetUserPreferenceById(Guid id)
        {
            return _userPrefRepo.GetById(id);
        }

        public Entities.Users.UserPreferences GetUserPreferenceByUserId(Guid userId)
        {
            return _userPrefRepo.GetAll().Where(up => up.UserId == userId).FirstOrDefault();
        }

        public void InstallPluginToUser(Guid userPrefId, Guid pluginId)
        {
            _userPrefPluginsRepo.Insert(new UserPreferencesPlugins()
            {
                PluginId = pluginId,
                UserPreferenceId = userPrefId
            });
        }

        public bool UpdateUserPreference(Entities.Users.UserPreferences userPref)
        {
            return _userPrefRepo.Update(userPref);
        }

        public void DeleteUserPreference(Guid id)
        {
            _userPrefRepo.Delete(id);
        }
    }
}
