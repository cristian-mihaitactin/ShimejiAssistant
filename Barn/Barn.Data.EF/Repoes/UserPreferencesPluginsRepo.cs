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

        public UserPreferencesPlugins GetById(Tuple<Guid, Guid> id)
        {
            return _dbContext.UserPreferencesPlugins.FirstOrDefault(upp => upp.UserPreferenceId== id.Item1 && upp.PluginId == id.Item2);
        }

        public bool Insert(UserPreferencesPlugins entity)
        {
            var exists = _dbContext.UserPreferencesPlugins.Any( x => x.PluginId == entity.PluginId && x.UserPreferenceId == entity.UserPreferenceId);
            if (exists)
            {
                return false;
            }
            _dbContext.UserPreferencesPlugins.Add(entity);
            _dbContext.SaveChanges();

            return true;
        }

        public bool Update(UserPreferencesPlugins entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(Tuple<Guid, Guid> id)
        {
            var entity = _dbContext.UserPreferencesPlugins.FirstOrDefault(upp => upp.UserPreferenceId == id.Item1 && upp.PluginId == id.Item2);
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
