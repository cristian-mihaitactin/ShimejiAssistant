using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.Entities.Bucky;
using Barn.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barn.Data.EF.Repoes
{
    public class BuckyProfileRepo: IGenericRepo<Guid, BuckyProfile>
    {
        private ApplicationDbContext _dbContext;

        public BuckyProfileRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<BuckyProfile> GetAll()
        {
            return _dbContext.BuckyProfiles.ToList();
        }

        public async Task<BuckyProfile> GetAsyncById(Guid id)
        {
            var result = await _dbContext.BuckyProfiles.FindAsync(id);
            if (result == null)
            {
                return null;
            }
            result.Behaviours = _dbContext.BuckyBehaviours.Where(bb => bb.BuckyProfileId == id).ToList();

            return result;
        }

        public async Task<bool> InsertAsync(BuckyProfile entity)
        {
            if (!_dbContext.BuckyProfiles.Contains(entity))
            {
                await _dbContext.BuckyProfiles.AddAsync(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateAsync(BuckyProfile entity)
        {
            var existingEntitiy = await _dbContext.BuckyProfiles.FindAsync(entity.Id);
            if (existingEntitiy == null)
            {
                return false;

            }

            _dbContext.BuckyProfiles.Update(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;

            _dbContext.SaveChanges();
            return true;
        }

        public async Task DeleteAsync(Guid id)
        {

            var entity = await _dbContext.BuckyProfiles.FindAsync(id);

            if (entity == null)
            {
                return;
            }

            _dbContext.BuckyProfiles.Remove(entity);
            _dbContext.Entry(entity).State = EntityState.Deleted;

            _dbContext.SaveChanges();
        }
    }
}
