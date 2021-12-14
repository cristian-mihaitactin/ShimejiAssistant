using Barn.Entities;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Barn.Data.EF;
using Barn.Entities.Users;

namespace Barn.Data.Mock
{
    public class UserRepo : IGenericRepo<Guid, User>
    {
        private ApplicationDbContext _dbContext;
        private IGenericRepo<Guid, UserPreferences> _userPrefRepo;

        public UserRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _userPrefRepo = new UserPreferencesRepo(dbContext);
        }

        public IEnumerable<User> GetAll()
        {
            return _dbContext.Users;
        }

        public User GetById(Guid id)
        {
            return _dbContext.Users.FirstOrDefault(u => u.Id == id);
        }

        public bool Insert(User entity)
        {
            if (!_dbContext.Users.Contains(entity))
            {
                _dbContext.Users.Add(entity);
                _userPrefRepo.Insert(entity.UserPreferences);
            } else
            {
                return false;
            }

            return true;
        }

        public bool Update(User entity)
        {
            if (!_dbContext.Users.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _dbContext.Users.Where(u => u.Id == entity.Id).FirstOrDefault();
            if (existingEntitiy == null)
            {
                return false;
            }

            _dbContext.Users[_dbContext.Users.IndexOf(existingEntitiy)] = entity;
            _userPrefRepo.Update(entity.UserPreferences);

            return true;
        }
        public bool Delete(Guid id)
        {

            var user = _dbContext.Users.Where(u => u.Id == id).FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            var userPrefDeleted = _userPrefRepo.Delete(user.UserPreferences.Id);

            if (userPrefDeleted)
            {
                return _dbContext.Users.Remove(user);
            }

            return false;
        }
    }
}
