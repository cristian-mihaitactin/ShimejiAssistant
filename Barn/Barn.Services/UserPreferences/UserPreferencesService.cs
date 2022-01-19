using Barn.Services.BuckyProfile;
using Barn.Services.Interfaces;
using System;
using System.Linq;

namespace Barn.Services.UserPreferences
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private IGenericRepo<Guid, Entities.Users.UserPreferences> _userPrefRepo;
        private IBuckyProfileService _buckyProfService;

        public UserPreferencesService(IGenericRepo<Guid, Entities.Users.UserPreferences> userPrefRepo,
            IBuckyProfileService buckyProfileService)
        {
            _userPrefRepo = userPrefRepo;
            _buckyProfService = buckyProfileService;
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
