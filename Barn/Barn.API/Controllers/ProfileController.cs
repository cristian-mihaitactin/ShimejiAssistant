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
        private IProfileService _profileService;
        // Create a field to store the mapper object
        private readonly IMapper _mapper;

        public ProfileController(IMapper mapper, IProfileService profileService)
        {
            _profileService = profileService;
            _mapper = mapper;

        }

        [HttpGet("{id}")]
        public ProfileModel Get(Guid id)
        {
            var profile = _profileService.GetProfile(id);
            return _mapper.Map<ProfileModel>(profile);
        }
    }
}
