using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.UserPreferences
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private IGenericRepo<Guid, Entities.UserPreferences> _userPrefRepo;

        public UserPreferencesService(IGenericRepo<Guid, Entities.UserPreferences> userPrefRepo)
        {
            _userPrefRepo = userPrefRepo;
        }
        public bool CreateUserPreference(Entities.UserPreferences userPref)
        {
            return _userPrefRepo.Insert(userPref);
        }

        public Entities.UserPreferences GetUserPreferenceById(Guid id)
        {
            return _userPrefRepo.GetById(id);
        }

        public Entities.UserPreferences GetUserPreferenceByUserId(Guid userId)
        {
            throw new NotImplementedException();
        }

        public bool UpdateUserPreference(Entities.UserPreferences userPref)
        {
            return _userPrefRepo.Update(userPref);
        }

        public bool DeleteUserPreference(Guid id)
        {
            return _userPrefRepo.Delete(id);
        }
    }
}
