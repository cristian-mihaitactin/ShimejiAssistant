using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Barn.API.Models;
using Barn.Services.BuckyProfile;

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private IBuckyProfileService _profileService;
        // Create a field to store the mapper object
        private readonly IMapper _mapper;

        public ProfileController(IMapper mapper, IBuckyProfileService profileService)
        {
            _profileService = profileService;
            _mapper = mapper;

        }

        [HttpGet("")]
        public IList<BuckyProfileModel> GetAll()
        {
            return _profileService.GetAllProfiles().Select(b => _mapper.Map<BuckyProfileModel>(b)).ToList();
        }

        [HttpGet("{id}")]
        public BuckyProfileModel Get(Guid id)
        {
            var profile = _profileService.GetProfile(id);
            //var behaviourModels = profile.Behaviours.Select(b => _mapper.Map<BuckyBehaviourModel>(b)).ToList();
            var profileModel =  _mapper.Map<BuckyProfileModel>(profile);
            return profileModel;
        }
    }
}
