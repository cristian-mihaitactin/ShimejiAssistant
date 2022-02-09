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
            return _dbContext.Plugins;
        }

        public Plugin GetById(Guid id)
        {
            return (Plugin)_dbContext.Plugins.FirstOrDefault(p => p.Id == id);
        }

        public bool Insert(Plugin entity)
        {
            throw new NotImplementedException();
        }

        public bool Update(Plugin entity)
        {
            if (!_dbContext.Plugins.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _dbContext.Plugins.FirstOrDefault(u => u.Id == entity.Id);
            if (existingEntitiy == null)
            {
                return false;
            }

            try
            {
                _dbContext.Plugins.Update(entity);
                _dbContext.Entry(entity).State = EntityState.Modified;

                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw;
            }

            return true;
        }

        public void Delete(Guid id)
        {
            var entity = _dbContext.Plugins.FirstOrDefault(u => u.Id == id);
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
