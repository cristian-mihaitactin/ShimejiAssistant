using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.AzIntegration.BuckyBehaviour;
using Barn.Services.Interfaces;

namespace Barn.Services.BuckyProfile
{
    public class ProfileService
    {
        private BehaviourClient _behaviourClient;
        private IGenericRepo<Guid, Entities.Bucky.BuckyProfile> _buckyProfileRepo;

        public ProfileService(string connectionString,IGenericRepo<Guid, 
            Entities.Bucky.BuckyProfile> buckyProfileRepo)
        {
            _behaviourClient = new BehaviourClient(connectionString);
            _buckyProfileRepo = buckyProfileRepo;
        }

        public Profile GetProfile(Guid id)
        {
            //Get profile and behaviours from sql
            var buckyProfile = _buckyProfileRepo.GetById(id);
            var profile = new Profile(buckyProfile);

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
