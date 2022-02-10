using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Barn.API.Models;
using Barn.Services.BuckyProfile;
using Microsoft.AspNetCore.Authorization;
using OpenIddict.Validation.AspNetCore;
using Barn.Services.UserPreferences;
using Barn.Entities.Users;
using Microsoft.AspNetCore.Identity;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private IBuckyProfileService _profileService;
        private IUserPreferencesService _userPrefService;
        UserManager<User> _userManager;

        // Create a field to store the mapper object
        private readonly IMapper _mapper;

        public ProfileController(IMapper mapper,
            UserManager<User> userManager,
            IBuckyProfileService profileService,
            IUserPreferencesService userPrefService)
        {
            _profileService = profileService;
            _userPrefService = userPrefService;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("")]
        public IList<BuckyProfileModel> GetAll()
        {
            return _profileService.GetAllProfiles().Select(b => _mapper.Map<BuckyProfileModel>(b)).ToList();
        }

        [HttpGet("{id}")]
        [SwaggerResponse(500, "Error retrieving BuckyProfileModel")]
        [SwaggerResponse(404, "BuckyProfileModel not found for provided id")]
        public async Task<IActionResult> Get(Guid id)
        {
            var profile = await _profileService.GetProfile(id);

            if (profile == null)
            {
                return NotFound();
            }

            var behaviourModels = profile.Behaviours.Select(b => new BuckyBehaviourModel(b)/*_mapper.Map<BuckyBehaviourModel>(b)*/).ToList();
            var profileModel = _mapper.Map<BuckyProfileModel>(profile);
            profileModel.Behaviours = behaviourModels;
            return Ok(profileModel);

        }


        [HttpGet("/api/User/Profile")]
        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]

        public async Task<BuckyProfileModel> GetUserProfile()
        {
            var user = await GetUser();

            var found = _userPrefService.GetUserPreferenceByUserId(user.Id);

            var profile = await _profileService.GetProfile(found.BuckyProfileID);
            var behaviourModels = profile.Behaviours.Select(b => new BuckyBehaviourModel(b)/*_mapper.Map<BuckyBehaviourModel>(b)*/).ToList();
            var profileModel = _mapper.Map<BuckyProfileModel>(profile);
            profileModel.Behaviours = behaviourModels;
            return profileModel;
        }

        private async Task<User> GetUser()
        {
            return await _userManager.FindByNameAsync(HttpContext.User.Identity.Name);
        }
    }
}
