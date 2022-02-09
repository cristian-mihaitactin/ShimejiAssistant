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
            throw new NotImplementedException();
        }

        public PluginNotification GetById(Guid id)
        {
            throw new NotImplementedException();
        }

        public bool Insert(PluginNotification entity)
        {
            throw new NotImplementedException();
        }

        public bool Update(PluginNotification entity)
        {
            if (!_dbContext.PluginNotifications.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _dbContext.PluginNotifications.FirstOrDefault(u => u.Id == entity.Id);
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

        public void Delete(Guid id)
        {
            var entity = _dbContext.PluginNotifications.FirstOrDefault(u => u.Id == id);
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
