using Barn.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Entities.Users;

namespace Barn.API.Models
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public UserModel() { }

        public UserModel(User user)
        {
            Id = user.Id;
            UserName = user.UserName;
        }

        public User ToEntity()
        {
            return new User()
            {
                Id = this.Id,
                UserName = this.UserName,
                UserPreferences = new UserPreferences()
            };
        }
    }
}
