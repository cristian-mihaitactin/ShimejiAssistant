using Barn.API.Models;
using Barn.Entities.Plugins;
using Barn.Entities.Users;
using Barn.Services.Plugins;
using Barn.Services.UserPreferences;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPeferencesController : ControllerBase
    {
        private IUserPreferencesService _userPrefService;
        private IPluginService _pluginService;
        private UserManager<User> _userManager;

        public UserPeferencesController(IUserPreferencesService userPrefService,
            IPluginService pluginService,
            UserManager<User> userManager
            )
        {
            _userPrefService = userPrefService;
            _pluginService = pluginService;
            _userManager = userManager;

        }
        // GET api/<UserPeferencesController>/5
        [HttpGet]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        [SwaggerResponse((int)HttpStatusCode.Accepted, "", typeof(UserPreferencesModel))]
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
            var userPreferencesPlugins = new List<UserPreferencesPlugins>();
            foreach(var userPlugin in found.UserPreferencesPlugins)
            {
                var plugin = _pluginService.GetPlugin(userPlugin.PluginId);
                userPlugin.Plugin = plugin;

                userPreferencesPlugins.Add(userPlugin);
            }

            found.UserPreferencesPlugins = userPreferencesPlugins;
            return Ok(new UserPreferencesModel(found));
        }

        // PUT api/<UserPeferencesController>/5
        [HttpPut]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public async Task Put([FromBody] UserPreferencesModel value)
        {
            var user = await GetUser();
            var found = _userPrefService.GetUserPreferenceByUserId(user.Id);
            found.BuckyProfileID = value.BuckyProfileID;
            _userPrefService.UpdateUserPreference(found);
        }

        [HttpPost("/api/UserPeferences/Plugin/{pluginId}")]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Post(Guid pluginId)
        {
            var user = await GetUser();
            var found = _userPrefService.GetUserPreferenceByUserId(user.Id);

            _userPrefService.InstallPluginToUser(found.Id,pluginId);
            return Ok();
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
