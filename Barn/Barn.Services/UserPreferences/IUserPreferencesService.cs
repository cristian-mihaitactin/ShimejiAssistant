﻿using System;

namespace Barn.Services.UserPreferences
{
    public interface IUserPreferencesService
    {
        Entities.Users.UserPreferences GetUserPreferenceById(Guid id);
        
        Entities.Users.UserPreferences GetUserPreferenceByUserId(Guid userId);
        bool CreateUserPreference(Entities.Users.UserPreferences userPref);
        bool UpdateUserPreference(Entities.Users.UserPreferences userPref);
        void InstallPluginToUser(Guid userPrefId, Guid pluginId);
        void DeleteUserPreference(Guid id);
        void CreateDefaultUserPreference(Entities.Users.User user);
    }
}
