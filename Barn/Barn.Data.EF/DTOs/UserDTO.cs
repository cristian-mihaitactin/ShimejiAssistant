using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barn.Data.EF.DTOs
{
    public class UserDTO: IdentityUser<Guid>
    {
        [Key]
        public override Guid Id { get; set; }
        [Required]
        public override string UserName { get; set; }
        [Required]
        public override string Email { get; set; }
        public UserPreferencesDTO UserPreferences { get; set; }
        public byte[] RowVersion { get; set; }

    }
}
