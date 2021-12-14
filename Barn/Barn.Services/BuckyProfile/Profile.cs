using System;
using System.Collections.Generic;
using Barn.Entities;

namespace Barn.Services.BuckyProfile
{
    public class Profile
    {
        private readonly Entities.Bucky.BuckyProfile _buckyProfile;
        private List<Behaviour> _behaviours;
        public IList<Behaviour> Behaviours => _behaviours;

        public Profile(Entities.Bucky.BuckyProfile buckyProfile)
        {
            _buckyProfile = buckyProfile;
            foreach (var buckyBehaviour in _buckyProfile.Behaviours)
            {
                _behaviours.Add(new Behaviour(buckyBehaviour));
            }
        }
    }
}
