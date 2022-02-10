using Barn.Entities;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Barn.Data.EF;
using Barn.Entities.Users;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
            return _dbContext.Users.ToList();
        }

        public async Task<User> GetAsyncById(Guid id)
        {
            var result = await _dbContext.Users.FindAsync(id);

            return result;
        }

        public async Task<bool> InsertAsync(User entity)
        {
            if (!_dbContext.Users.Contains(entity))
            {
                await _dbContext.Users.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(User entity)
        {
            var existingEntitiy = await _dbContext.Users.FindAsync(entity.Id);
            if (existingEntitiy == null)
            {
                return false;

            }

            try
            {
                _dbContext.Users.Update(entity);
                await _userPrefRepo.UpdateAsync(entity.UserPreferences);

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
        public async Task DeleteAsync(Guid id)
        {

            var entity = await _dbContext.Users.FindAsync(id);

            if (entity == null)
            {
                return;
            }

            await _userPrefRepo.DeleteAsync(entity.UserPreferences.Id);
            _dbContext.Users.Remove(entity);

            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
