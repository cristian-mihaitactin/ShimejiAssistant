using Barn.Entities;
using Barn.Services.Interfaces;
using Barn.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.Data.EF;
using Microsoft.EntityFrameworkCore;

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

        public async Task<UserPreferences> GetAsyncById(Guid id)
        {
            var userPref = await _dbContext.UsersPreferences.FindAsync(id);
            if( userPref == null)
            {
                return null;
            }

            var userPrefPlugins = _dbContext.UserPreferencesPlugins.Where(usp => usp.UserPreferenceId == id).ToList();
            userPref.UserPreferencesPlugins = userPrefPlugins;

            return userPref;
        }

        public async Task<bool> InsertAsync(UserPreferences entity)
        {
            if (!_dbContext.UsersPreferences.Contains(entity))
            {
                await _dbContext.UsersPreferences.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(UserPreferences entity)
        {
            var existingEntitiy = await _dbContext.UsersPreferences.FindAsync(entity.Id);
            if (existingEntitiy == null)
            {
                return false;

            }

            try
            {
                _dbContext.UsersPreferences.Update(entity);
                _dbContext.Entry(entity).State = EntityState.Modified;

                _dbContext.SaveChanges();
            } catch (Exception ex)
            {
                throw;
            }

            return true;
        }

        public async Task DeleteAsync(Guid id)
        {

            var entity = await _dbContext.UsersPreferences.FindAsync(id);

            if (entity == null)
            {
                return;
            }

            _dbContext.UsersPreferences.Remove(entity);
            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
