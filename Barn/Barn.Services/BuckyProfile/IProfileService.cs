using System;

namespace Barn.Services.BuckyProfile
{
    public interface IProfileService
    {
        Profile GetProfile(Guid id);
    }
}