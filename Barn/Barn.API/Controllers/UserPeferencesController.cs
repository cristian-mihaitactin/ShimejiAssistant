using Barn.API.Models;
using Barn.Services.UserPreferences;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPeferencesController : ControllerBase
    {
        private IUserPreferencesService _userPrefService;

        public UserPeferencesController(IUserPreferencesService userPrefService)
        {
            _userPrefService = userPrefService;

        }
        // GET api/<UserPeferencesController>/5
        [HttpGet("{id}")]
        public UserPreferencesModel Get(Guid id)
        {
            return new UserPreferencesModel(_userPrefService.GetUserPreferenceById(id));
        }

        // POST api/<UserPeferencesController>
        [HttpPost]
        public void Post([FromBody] UserPreferencesModel value)
        {
            _userPrefService.CreateUserPreference(value.ToEntity());
        }

        // PUT api/<UserPeferencesController>/5
        [HttpPut("{id}")]
        public void Put(Guid id, [FromBody] UserPreferencesModel value)
        {
            _userPrefService.UpdateUserPreference(value.ToEntity());
        }

        // DELETE api/<UserPeferencesController>/5
        [HttpDelete("{id}")]
        public void Delete(Guid id)
        {
            _userPrefService.DeleteUserPreference(id);
        }
    }
}
