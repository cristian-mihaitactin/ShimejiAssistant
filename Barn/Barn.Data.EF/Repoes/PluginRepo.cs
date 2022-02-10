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
    public class PluginRepo : IGenericRepo<Guid, Plugin>
    {
        private ApplicationDbContext _dbContext;

        public PluginRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<Plugin> GetAll()
        {
            return _dbContext.Plugins.ToList();
        }

        public async Task<Plugin> GetAsyncById(Guid id)
        {
            var result = await _dbContext.Plugins.FindAsync(id);
            if (result == null)
            {
                return null;
            }

            return result;
        }

        public async Task<bool> InsertAsync(Plugin entity)
        {
            if (!_dbContext.Plugins.Contains(entity))
            {
                await _dbContext.Plugins.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(Plugin entity)
        {
            var existingEntitiy = await _dbContext.Plugins.FindAsync(entity.Id);
            if (existingEntitiy == null)
            {
                return false;

            }

            _dbContext.Plugins.Update(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;

            _dbContext.SaveChanges();
            return true;
        }

        public async Task DeleteAsync(Guid id)
        {

            var entity = await _dbContext.Plugins.FindAsync(id);

            if (entity == null)
            {
                return;
            }

            _dbContext.Plugins.Remove(entity);
            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
