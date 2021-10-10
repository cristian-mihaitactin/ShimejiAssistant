using System;
using Barn.Entities;
namespace Barn.Services.User
{
    public interface IUserService
    {
        Barn.Entities.User GetUserById(Guid id);
        bool CreateUser(Barn.Entities.User user);
        bool UpdateUser(Barn.Entities.User user);
        bool DeleteUser(Barn.Entities.User user);

    }
}
