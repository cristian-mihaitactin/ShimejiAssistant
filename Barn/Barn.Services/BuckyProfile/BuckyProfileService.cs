﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barn.AzIntegration.BuckyBehaviour;
using Barn.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Barn.Services.BuckyProfile
{
    public class BuckyProfileService: IBuckyProfileService
    {
        public Guid DEFAULT_BUCKY_PROFILE = new Guid("8919E40E-D588-42F2-A0A8-4AFB9AD1589B");
        private IBehaviourClient _behaviourClient;
        private IGenericRepo<Guid, Entities.Bucky.BuckyProfile> _buckyProfileRepo;
        private IConfiguration _configuration;

        public BuckyProfileService(IGenericRepo<Guid, 
            Entities.Bucky.BuckyProfile> buckyProfileRepo, IConfiguration configuration)
        {
            _configuration = configuration;
            _behaviourClient = new BehaviourClient(_configuration.GetConnectionString("AzStorageConnectionString"));
            _buckyProfileRepo = buckyProfileRepo;
        }

        public BuckyProfileService(IGenericRepo<Guid,
            Entities.Bucky.BuckyProfile> buckyProfileRepo, IBehaviourClient behaviourClient)
        {
            _behaviourClient = behaviourClient;
            _buckyProfileRepo = buckyProfileRepo;
        }

        public async Task<BuckyProfileDTO> GetProfile(Guid id)
        {
            //Get profile and behaviours from sql
            var buckyProfile = await _buckyProfileRepo.GetAsyncById(id);
            var profile = new BuckyProfileDTO(buckyProfile);

            //Get behaviour blobs
            foreach (var profileBehaviour in profile.Behaviours)
            {
                var imageBytes = await _behaviourClient.GetBehaviourBlob(profileBehaviour.BuckyBehaviour);
                profileBehaviour.ImageBytes = imageBytes.Image;
            }

            return profile;
        }

        public IList<BuckyProfileDTO> GetAllProfiles() => _buckyProfileRepo.GetAll().Select(b => new BuckyProfileDTO(b)).ToList();
        public BuckyProfileDTO GetDefaultProfile()
        {
            return new BuckyProfileDTO()
            {
                Id = DEFAULT_BUCKY_PROFILE
            };
        }
    }
}
