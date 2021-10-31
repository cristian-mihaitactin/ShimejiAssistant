using System;

namespace Barn.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public UserPreferences UserPreferences { get; set; }
    }
}
