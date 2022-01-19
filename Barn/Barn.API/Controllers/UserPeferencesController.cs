using Barn.API.Models;
using Barn.Entities.Users;
using Barn.Services.UserPreferences;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;
using Swashbuckle.AspNetCore.Annotations;
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
        private UserManager<User> _userManager;

        public UserPeferencesController(IUserPreferencesService userPrefService,
            UserManager<User> userManager
            )
        {
            _userPrefService = userPrefService;
            _userManager = userManager;

        }
        // GET api/<UserPeferencesController>/5
        [HttpGet]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        [SwaggerResponse(500, "Error retrieving UserPreferences")]
        [SwaggerResponse(404, "UserPreferences not found for user")]
        public async Task<IActionResult> Get()
        {
            var user = await GetUser();
            var found = _userPrefService.GetUserPreferenceByUserId(user.Id);
            if (found == null)
            {
                return NotFound();
            }
            return Ok(new UserPreferencesModel(found));
        }

        // PUT api/<UserPeferencesController>/5
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public void Put(Guid id, [FromBody] UserPreferencesModel value)
        {
            _userPrefService.UpdateUserPreference(value.ToEntity());
        }

        // DELETE api/<UserPeferencesController>/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public void Delete(Guid id)
        {
            _userPrefService.DeleteUserPreference(id);
        }
        private async Task<User> GetUser()
        {
            return await _userManager.FindByNameAsync(HttpContext.User.Identity.Name);
        }
    }
}
