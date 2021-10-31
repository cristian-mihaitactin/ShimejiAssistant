using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barn.Data.EF.DTOs
{
    public class UserPreferencesDTO
    {
        [Key]
        public Guid Id { get; set; }
        public UserDTO User { get; set; }
        public Guid UserId { get; set; }
        public byte[] RowVersion { get; set; }
    }
}