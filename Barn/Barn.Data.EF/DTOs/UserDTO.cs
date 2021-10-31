using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barn.Data.EF.DTOs
{
    public class UserDTO
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        public UserPreferencesDTO UserPreferences { get; set; }
        public byte[] RowVersion { get; set; }

    }
}
