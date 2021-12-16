using System;

namespace Barn.Services.BuckyProfile
{
    public interface IBuckyProfileService
    {
        BuckyProfileDTO GetProfile(Guid id);
    }
}