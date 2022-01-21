using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Barn.Entities.Bucky;
using Barn.Entities.Plugins;

namespace Barn.Entities.Users
{
    public class UserPreferences: EntityWithRowVersion
    {
        [Key]
        public Guid Id { get; set; }
        public User User { get; set; }
        public Guid UserId { get; set; }
        public BuckyProfile BuckyProfile { get; set; }
        public Guid BuckyProfileID { get; set; }
        public IList<UserPreferencesPlugins> UserPreferencesPlugins { get; set; }
    }
}