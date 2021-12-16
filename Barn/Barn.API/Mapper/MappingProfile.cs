using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.API.Models;
using Barn.Entities.Users;
using Barn.Services.BuckyProfile;
using Profile = AutoMapper.Profile;

namespace Barn.API.Mapper
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<User, UserModel>();
            CreateMap<UserModel, User>();

            CreateMap<BuckyBehaviourDTO, BuckyBehaviourModel>();
            CreateMap<BuckyBehaviourModel, BuckyBehaviourDTO>();

            CreateMap<Barn.Services.BuckyProfile.BuckyProfileDTO, BuckyProfileModel>();
            CreateMap<BuckyProfileModel, Barn.Services.BuckyProfile.BuckyProfileDTO>();
        }
    }
}
