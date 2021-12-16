using System;
using System.Collections.Generic;
using Barn.Entities;

namespace Barn.Services.BuckyProfile
{
    public class BuckyProfileDTO
    {
        private readonly Entities.Bucky.BuckyProfile _buckyProfile;
        private List<BuckyBehaviourDTO> _behaviours;
        public IList<BuckyBehaviourDTO> Behaviours => _behaviours;

        public BuckyProfileDTO(Entities.Bucky.BuckyProfile buckyProfile)
        {
            _buckyProfile = buckyProfile;
            foreach (var buckyBehaviour in _buckyProfile.Behaviours)
            {
                _behaviours.Add(new BuckyBehaviourDTO(buckyBehaviour));
            }
        }
    }
}
