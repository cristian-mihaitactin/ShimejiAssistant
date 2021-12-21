using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.AzIntegration.BuckyBehaviour;
using Barn.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Barn.Services.BuckyProfile
{
    public class BuckyProfileService: IBuckyProfileService
    {
        private BehaviourClient _behaviourClient;
        private IGenericRepo<Guid, Entities.Bucky.BuckyProfile> _buckyProfileRepo;

        public BuckyProfileService(IGenericRepo<Guid, 
            Entities.Bucky.BuckyProfile> buckyProfileRepo)
        {
            _behaviourClient = new BehaviourClient("UseDevelopmentStorage=true");
            _buckyProfileRepo = buckyProfileRepo;
        }

        public BuckyProfileDTO GetProfile(Guid id)
        {
            //Get profile and behaviours from sql
            var buckyProfile = _buckyProfileRepo.GetById(id);
            var profile = new BuckyProfileDTO(buckyProfile);

            //Get behaviour blobs
            foreach (var profileBehaviour in profile.Behaviours)
            {
                var imageBytes = _behaviourClient.GetBehaviourBlob(profileBehaviour.BuckyBehaviour).Result;
                profileBehaviour.ImageBytes = imageBytes.Image;
            }

            return profile;
        }
    }
}
