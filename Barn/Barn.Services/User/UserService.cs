using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.User
{
    public class UserService : IUserService
    {
        private IGenericRepo<Guid, Entities.User> _userRepo;

        public UserService(IGenericRepo<Guid, Entities.User> userRepo)
        {
            _userRepo = userRepo;
        }

        public bool CreateUser(Entities.User user)
        {
            return _userRepo.Insert(user);
        }

        public Entities.User GetUserById(Guid id)
        {
            return _userRepo.GetById(id);
        }

        public bool UpdateUser(Entities.User user)
        {
            return _userRepo.Update(user);
        }

        public bool DeleteUser(Guid id)
        {
            return _userRepo.Delete(id);
        }
    }
}
