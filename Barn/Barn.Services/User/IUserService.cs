using System;
using System.Threading.Tasks;

namespace Barn.Services.User
{
    public interface IUserService
    {
        Task<Entities.Users.User> GetUserById(Guid id);
        Task<bool> CreateUser(Entities.Users.User user);
        Task<bool> UpdateUser(Entities.Users.User user);
        Task DeleteUser(Guid id);

    }
}
