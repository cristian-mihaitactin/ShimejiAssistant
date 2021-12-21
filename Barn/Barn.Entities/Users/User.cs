using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Barn.Entities.Users
{
    public class User: IdentityUser<Guid>
    {
        [Key]
        public override Guid Id { get; set; }
        [Required]
        public override string UserName { get; set; }
        [Required]
        public override string Email { get; set; }
        public UserPreferences UserPreferences { get; set; }
        public byte[] RowVersion { get; set; }

    }
}
