using System;
using Barn.Services.Interfaces;
using Barn.Entities.Users;
using System.Threading.Tasks;

namespace Barn.Services.User
{
    public class UserService : IUserService
    {
        private IGenericRepo<Guid, Entities.Users.User> _userRepo;

        public UserService(IGenericRepo<Guid, Entities.Users.User> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<bool> CreateUser(Entities.Users.User user)
        {
            return await _userRepo.InsertAsync(user);
        }

        public async Task<Entities.Users.User> GetUserById(Guid id)
        {
            return await _userRepo.GetAsyncById(id);
        }

        public async Task<bool> UpdateUser(Entities.Users.User user)
        {
            return await _userRepo.UpdateAsync(user);
        }

        public async Task DeleteUser(Guid id)
        {
            await _userRepo.DeleteAsync(id);
        }
    }
}
