using Barn.API.Models;
using Barn.Entities.Users;
using Barn.Services.User;
using Microsoft.AspNetCore;
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
    public class UserController : ControllerBase
    {
        IUserService _userService; 
        private readonly UserManager<User> _userManager;

        public UserController(IUserService userService, 
            UserManager<User> userManager
            )
        {
            _userService = userService;
            _userManager = userManager;
        }

        // GET: api/<UserController>
        //[HttpGet]
        //public IEnumerable<UserModel> Get()
        //{
        //    return _userService.GetAll();
        //}

        // GET api/<UserController>/5
        [HttpGet]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        [SwaggerResponse(500, "Error retrieving User")]
        [SwaggerResponse(404, "User not found")]
        public async Task<IActionResult> GetAsync()
        {
            var user = await GetUser();
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new UserModel(user));
        }

        // PUT api/<UserController>/5
        [HttpPut]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public async void Put([FromBody] UserModel value)
        {
            var userValue = await GetUser();
            userValue.Email = value.Email;
            userValue.FirstName = value.FirstName;
            userValue.LastName = value.LastName;

            await _userManager.UpdateAsync(userValue);
            // _userService.UpdateUser(value.ToEntity());
        }

        // DELETE api/<UserController>/5
        [HttpDelete]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
        public async Task Delete()
        {
            var user = await GetUser();
            await _userManager.DeleteAsync(user);
        }

        private async Task<User> GetUser()
        {
            return await _userManager.FindByNameAsync(HttpContext.User.Identity.Name);

        }
    }
}
