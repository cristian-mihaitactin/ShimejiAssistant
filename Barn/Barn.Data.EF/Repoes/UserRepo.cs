using Barn.Entities;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Barn.Data.EF;
using Barn.Entities.Users;
using Microsoft.EntityFrameworkCore;

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

            var existingEntitiy = _dbContext.Users.FirstOrDefault(u => u.Id == entity.Id);
            if (existingEntitiy == null)
            {
                return false;
            }


            try
            {
                _dbContext.Users.Update(entity);
                _userPrefRepo.Update(entity.UserPreferences);

                _dbContext.Entry(entity).State = EntityState.Modified;
                _dbContext.Entry(entity.UserPreferences).State = EntityState.Modified;

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

            var entity = _dbContext.Users.FirstOrDefault(u => u.Id == id);

            if (entity == null)
            {
                return;
            }

            _userPrefRepo.Delete(entity.UserPreferences.Id);
            _dbContext.Users.Remove(entity);

            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
