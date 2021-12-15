using System;

namespace Barn.Services.User
{
    public interface IUserService
    {
        Entities.Users.User GetUserById(Guid id);
        bool CreateUser(Entities.Users.User user);
        bool UpdateUser(Entities.Users.User user);
        void DeleteUser(Guid id);

    }
}
