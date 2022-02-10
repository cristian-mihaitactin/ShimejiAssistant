using Barn.Entities.Plugins;
using Barn.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Data.EF.Repoes
{
    public class UserPreferencesPluginsRepo : IGenericRepo<Tuple<Guid, Guid>, UserPreferencesPlugins>
    {
        private ApplicationDbContext _dbContext;

        public UserPreferencesPluginsRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<UserPreferencesPlugins> GetAll()
        {
            return _dbContext.UserPreferencesPlugins.ToList();
        }

        public async Task<UserPreferencesPlugins> GetAsyncById(Tuple<Guid, Guid> id)
        {
            var result = await _dbContext.UserPreferencesPlugins.FindAsync(id.Item1,id.Item2);
            if (result == null)
            {
                return null;
            }

            return result;
        }

        public async Task<bool> InsertAsync(UserPreferencesPlugins entity)
        {
            var exists = await _dbContext.UserPreferencesPlugins.AnyAsync( x => x.PluginId == entity.PluginId && x.UserPreferenceId == entity.UserPreferenceId);
            if (!exists)
            {
                await _dbContext.UserPreferencesPlugins.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(UserPreferencesPlugins entity)
        {
            var existingEntitiy = await _dbContext.UserPreferencesPlugins.FindAsync(entity.PluginId,entity.UserPreferenceId);
            if (existingEntitiy == null)
            {
                return false;

            }

            _dbContext.UserPreferencesPlugins.Update(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;

            _dbContext.SaveChanges();
            return true;
        }

        public async Task DeleteAsync(Tuple<Guid, Guid> id)
        {
            var entity = await _dbContext.UserPreferencesPlugins.FindAsync(id.Item1, id.Item2);
            if (entity == null)
            {
                return;
            }

            _dbContext.UserPreferencesPlugins.Remove(entity);
            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
