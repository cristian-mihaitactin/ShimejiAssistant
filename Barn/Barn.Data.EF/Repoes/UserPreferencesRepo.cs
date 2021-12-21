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
            return _dbContext.UsersPreferences;
        }

        public UserPreferences GetById(Guid id)
        {
            return _dbContext.UsersPreferences.FirstOrDefault(u => u.Id == id);
        }

        public bool Insert(UserPreferences entity)
        {
            if (!_dbContext.UsersPreferences.Contains(entity))
            {
                _dbContext.UsersPreferences.Add(entity);
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

            _dbContext.UsersPreferences.Update(entity);

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
        }
    }
}
