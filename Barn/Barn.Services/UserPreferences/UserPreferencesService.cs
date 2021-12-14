using Barn.Services.Interfaces;
using System;

namespace Barn.Services.UserPreferences
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private IGenericRepo<Guid, Entities.Users.UserPreferences> _userPrefRepo;

        public UserPreferencesService(IGenericRepo<Guid, Entities.Users.UserPreferences> userPrefRepo)
        {
            _userPrefRepo = userPrefRepo;
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
            throw new NotImplementedException();
        }

        public bool UpdateUserPreference(Entities.Users.UserPreferences userPref)
        {
            return _userPrefRepo.Update(userPref);
        }

        public bool DeleteUserPreference(Guid id)
        {
            return _userPrefRepo.Delete(id);
        }
    }
}
