using System;
using Barn.Services.Interfaces;
using Barn.Entities.Users;

namespace Barn.Services.User
{
    public class UserService : IUserService
    {
        private IGenericRepo<Guid, Entities.Users.User> _userRepo;

        public UserService(IGenericRepo<Guid, Entities.Users.User> userRepo)
        {
            _userRepo = userRepo;
        }

        public bool CreateUser(Entities.Users.User user)
        {
            return _userRepo.Insert(user);
        }

        public Entities.Users.User GetUserById(Guid id)
        {
            return _userRepo.GetById(id);
        }

        public bool UpdateUser(Entities.Users.User user)
        {
            return _userRepo.Update(user);
        }

        public void DeleteUser(Guid id)
        {
            _userRepo.Delete(id);
        }
    }
}
