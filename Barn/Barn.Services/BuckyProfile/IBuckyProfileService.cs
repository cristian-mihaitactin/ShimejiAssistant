using System;
using System.Collections.Generic;

namespace Barn.Services.BuckyProfile
{
    public interface IBuckyProfileService
    {
        BuckyProfileDTO GetProfile(Guid id);
        IList<BuckyProfileDTO> GetAllProfiles();
    }
}