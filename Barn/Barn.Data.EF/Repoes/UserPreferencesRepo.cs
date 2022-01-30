using Barn.Entities;
using Barn.Services.Interfaces;
using Barn.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.Data.EF;

namespace Barn.Data.Mock
{
    public class UserPreferencesRepo : IGenericRepo<Guid, UserPreferences>
    {
        private ApplicationDbContext _dbContext;

        public UserPreferencesRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<UserPreferences> GetAll()
        {
            var userPreferenceList = new List<UserPreferences>();

            foreach(var userPreference in _dbContext.UsersPreferences.ToList())
            {
                userPreference.UserPreferencesPlugins = _dbContext.UserPreferencesPlugins.Where(upp => upp.UserPreferenceId == userPreference.Id).ToList();
                userPreferenceList.Add(userPreference);
            }

            return userPreferenceList;
        }

        public UserPreferences GetById(Guid id)
        {
            var userPref = _dbContext.UsersPreferences.FirstOrDefault(x => x.Id == id);
            if( userPref == null)
            {
                return null;
            }

            var userPrefPlugins = _dbContext.UserPreferencesPlugins.Where(usp => usp.UserPreferenceId == id).ToList();
            userPref.UserPreferencesPlugins = userPrefPlugins;

            return userPref;
        }

        public bool Insert(UserPreferences entity)
        {
            if (!_dbContext.UsersPreferences.Contains(entity))
            {
                _dbContext.UsersPreferences.Add(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public bool Update(UserPreferences entity)
        {
            if (!_dbContext.UsersPreferences.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _dbContext.UsersPreferences.FirstOrDefault(u => u.Id == entity.Id);
            if (existingEntitiy == null)
            {
                return false;
            }

            try
            {
                _dbContext.UsersPreferences.Update(entity);
                _dbContext.SaveChanges();
            } catch (Exception ex)
            {
                throw;
            }

            return true;
        }

        public void Delete(Guid id)
        {
            var usPref = _dbContext.UsersPreferences.FirstOrDefault(u => u.Id == id);
            if (usPref == null)
            {
                return;
            }

            _dbContext.UsersPreferences.Remove(usPref);
            _dbContext.SaveChanges();
        }
    }
}
