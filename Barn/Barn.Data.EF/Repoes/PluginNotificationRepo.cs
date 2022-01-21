using Barn.Entities.Plugins;
using Barn.Services.Interfaces;
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

        public void Delete(Guid id)
        {
            throw new NotImplementedException();
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
            throw new NotImplementedException();
        }
    }
}
