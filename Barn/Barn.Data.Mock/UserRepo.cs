using Barn.Entities;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using Barn.Entities.Users;

namespace Barn.Data.Mock
{
    public class UserRepo : IGenericRepo<Guid, User>
    {
        User _firstUser = new User()
        {
            Id = Guid.Empty,
            UserName = "first.user",
            UserPreferences = new UserPreferences()
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Empty
            }
        };

        static Guid _genericUserId = Guid.NewGuid();

        User _genericUser = new User()
        {
            Id = _genericUserId,
            UserName = "generic.user",
            UserPreferences = new UserPreferences()
            {
                Id = Guid.NewGuid(),
                UserId = _genericUserId
            }
        };

        private IList<User> _userDB = new List<User>();

        private IGenericRepo<Guid, UserPreferences> _userPrefRepo;

        public UserRepo(IGenericRepo<Guid, UserPreferences> userPrefRepo)
        {
            _userPrefRepo = userPrefRepo;

            Init();
        }

        public UserRepo()
        {
            _userPrefRepo = new UserPreferencesRepo();
            Init();
        }


        private void Init()
        {
            Insert(_firstUser);
            Insert(_genericUser);
        }

        public IEnumerable<User> GetAll()
        {
            return _userDB;
        }

        public User GetById(Guid id)
        {
            return _userDB.Where(u => u.Id == id).FirstOrDefault();
        }

        public bool Insert(User entity)
        {
            if (!_userDB.Contains(entity))
            {
                _userDB.Add(entity);
                _userPrefRepo.Insert(entity.UserPreferences);
            } else
            {
                return false;
            }

            return true;
        }

        public bool Update(User entity)
        {
            if (!_userDB.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _userDB.Where(u => u.Id == entity.Id).FirstOrDefault();
            if (existingEntitiy == null)
            {
                return false;
            }

            _userDB[_userDB.IndexOf(existingEntitiy)] = entity;
            _userPrefRepo.Update(entity.UserPreferences);

            return true;
        }
        public bool Delete(Guid id)
        {

            var user = _userDB.Where(u => u.Id == id).FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            var userPrefDeleted = _userPrefRepo.Delete(user.UserPreferences.Id);

            if (userPrefDeleted)
            {
                return _userDB.Remove(user);
            }

            return false;
        }
    }
}
