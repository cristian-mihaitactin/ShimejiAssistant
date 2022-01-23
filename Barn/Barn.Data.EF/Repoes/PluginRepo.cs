using Barn.Entities.Plugins;
using Barn.Services.Interfaces;
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

        public void Delete(Guid id)
        {
            throw new NotImplementedException();
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
            throw new NotImplementedException();
        }
    }
}
