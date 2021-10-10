using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.UserPreferences
{
    public interface IUserPreferencesService
    {
        Barn.Entities.UserPreferences GetUserPreferenceById(Guid id);
        Barn.Entities.UserPreferences GetUserPreferenceByUserId(Guid userId);
        bool CreateUserPreference(Barn.Entities.UserPreferences userPref);
        bool UpdateUserPreference(Barn.Entities.UserPreferences userPref);
        bool DeleteUserPreference(Barn.Entities.UserPreferences userPref);
    }
}
