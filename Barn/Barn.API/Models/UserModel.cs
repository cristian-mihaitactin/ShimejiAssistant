﻿using Barn.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Barn.API.Models
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }

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