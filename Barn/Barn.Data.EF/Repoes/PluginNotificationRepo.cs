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
    public class PluginNotificationRepo : IGenericRepo<Guid, PluginNotification>
    {
        private ApplicationDbContext _dbContext;

        public PluginNotificationRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<PluginNotification> GetAll()
        {
            return _dbContext.PluginNotifications.ToList();
        }

        public async Task<PluginNotification> GetAsyncById(Guid id)
        {
            var result = await _dbContext.PluginNotifications.FindAsync(id);
            if (result == null)
            {
                return null;
            }

            return result;
        }

        public async Task<bool> InsertAsync(PluginNotification entity)
        {
            if (!_dbContext.PluginNotifications.Contains(entity))
            {
                await _dbContext.PluginNotifications.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(PluginNotification entity)
        {
            var existingEntitiy = await _dbContext.PluginNotifications.FindAsync(entity.Id);
            if (existingEntitiy == null)
            {
                return false;

            }

            try
            {
                _dbContext.PluginNotifications.Update(entity);
                _dbContext.Entry(entity).State = EntityState.Modified;

                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw;
            }

            return true;
        }

        public async Task DeleteAsync(Guid id)
        {

            var entity = await _dbContext.PluginNotifications.FindAsync(id);

            if (entity == null)
            {
                return;
            }

            _dbContext.PluginNotifications.Remove(entity);
            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
