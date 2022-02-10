using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Barn.Services.BuckyProfile
{
    public interface IBuckyProfileService
    {
        BuckyProfileDTO GetDefaultProfile();
        Task<BuckyProfileDTO> GetProfile(Guid id);
        IList<BuckyProfileDTO> GetAllProfiles();
    }
}