using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Barn.Entities;

namespace Barn.Services.BuckyProfile
{
    public class BuckyProfileDTO
    {
        private readonly Entities.Bucky.BuckyProfile _buckyProfile;
        public IList<BuckyBehaviourDTO> Behaviours { get; set; }
    
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public BuckyProfileDTO()
        {
            Behaviours = new List<BuckyBehaviourDTO>();
        }
        public BuckyProfileDTO(Entities.Bucky.BuckyProfile buckyProfile)
        {
            Id = buckyProfile.Id;
            Name = buckyProfile.Name;
            Description = buckyProfile.Description;

            _buckyProfile = buckyProfile;
            Behaviours = new List<BuckyBehaviourDTO>();
            if (_buckyProfile.Behaviours is null)
            {
                return;
            }
            foreach (var buckyBehaviour in _buckyProfile.Behaviours)
            {
                Behaviours.Add(new BuckyBehaviourDTO(buckyBehaviour));
            }
        }
    }
}
