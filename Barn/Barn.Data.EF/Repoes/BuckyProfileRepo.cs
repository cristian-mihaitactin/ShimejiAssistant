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
            return _dbContext.BuckyProfiles;
        }

        public BuckyProfile GetById(Guid id)
        {
            var result = _dbContext.BuckyProfiles.FirstOrDefault(u => u.Id == id);
            if (result == null)
            {
                return null;
            }
            result.Behaviours = _dbContext.BuckyBehaviours.Where(b => b.BuckyProfileId == id).ToList();

            return result;
        }

        public bool Insert(BuckyProfile entity)
        {
            if (!_dbContext.BuckyProfiles.Contains(entity))
            {
                _dbContext.BuckyProfiles.Add(entity);
                _dbContext.SaveChanges();
            }
            else
            {
                return false;
            }

            return true;
        }

        public bool Update(BuckyProfile entity)
        {
            if (!_dbContext.BuckyProfiles.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _dbContext.BuckyProfiles.FirstOrDefault(u => u.Id == entity.Id);
            if (existingEntitiy == null)
            {
                return false;
            }

            _dbContext.BuckyProfiles.Update(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;

            _dbContext.SaveChanges();
            return true;
        }
        public void Delete(Guid id)
        {

            var entity = _dbContext.BuckyProfiles.FirstOrDefault(u => u.Id == id);

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
