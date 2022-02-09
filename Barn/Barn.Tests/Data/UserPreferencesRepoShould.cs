﻿using Barn.Data.EF;
using Barn.Data.Mock;
using Barn.Entities.Users;
using Barn.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Barn.Tests.Data
{
    public class UserPreferencesRepoShould
    {
        private UserPreferencesRepo _userPreferencesRepo;
        private ApplicationDbContext _context;
        private List<UserPreferences> _userPreferenceList = new List<UserPreferences>(new UserPreferences[] {
                new UserPreferences()
        {
            BuckyProfile = new Entities.Bucky.BuckyProfile(),
                    BuckyProfileID = Guid.NewGuid(),
                    Id = Guid.NewGuid(),
                    User = null,
                    UserId = Guid.NewGuid(),
                    UserPreferencesPlugins = null
                },
                new UserPreferences()
        {
            BuckyProfile = new Entities.Bucky.BuckyProfile(),
                    BuckyProfileID = Guid.NewGuid(),
                    Id = Guid.NewGuid(),
                    User = null,
                    UserId = Guid.NewGuid(),
                    UserPreferencesPlugins = null
                },
                new UserPreferences()
        {
            BuckyProfile = new Entities.Bucky.BuckyProfile(),
                    BuckyProfileID = Guid.NewGuid(),
                    Id = Guid.NewGuid(),
                    User = null,
                    UserId = Guid.NewGuid(),
                    UserPreferencesPlugins = null
                }
    });

        public UserPreferencesRepoShould()
        {
            
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Bucky-test");

            _context = new ApplicationDbContext(builder.Options);

            /*
            var dbSetMock = DBHelper.GetQueryableMockDbSet(userPreferencesList);
            context.UsersPreferences = dbSetMock;
            */
            _context.UsersPreferences.AddRange(_userPreferenceList);
            int changed = _context.SaveChanges();

            _userPreferencesRepo = new UserPreferencesRepo(_context);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnAllUserPreferences()
        {
            //Arrange

            //Act
            var result = _userPreferencesRepo.GetAll();

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void InsertUserPreference()
        {
            //Arrange
            var userPrefId = Guid.Parse("34FF5D40-0064-4E1B-987C-AE59740CF30B");

            var userPref = new UserPreferences()
            {
                BuckyProfile = new Entities.Bucky.BuckyProfile(),
                BuckyProfileID = Guid.NewGuid(),
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };

            //Act
            var result = _userPreferencesRepo.Insert(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = _userPreferencesRepo.GetById(userPrefId);

            result.ShouldBeTrue();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldContain(userPref);
            Assert.True(userFound.Id == userPrefId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnUserPreferenceFoGivenId()
        {
            //Arrange
            var userPrefId = Guid.Parse("5E000909-73F0-42BD-A2B3-83B85354D8E0");

            var userPref = new UserPreferences()
            {
                BuckyProfile = new Entities.Bucky.BuckyProfile(),
                BuckyProfileID = Guid.NewGuid(),
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };

            _userPreferencesRepo.Insert(userPref);

            //Act
            var result = _userPreferencesRepo.GetById(userPrefId);

            //Assert
            result.ShouldNotBeNull();
            Assert.True(result.Id == userPrefId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnNullForUnknownId()
        {
            //Arrange
            var userPrefId = Guid.Parse("254F75BA-8679-4049-B646-CCD32FCC9C1E");

            //Act
            var result = _userPreferencesRepo.GetById(userPrefId);

            //Assert
            result.ShouldBeNull();
        }

        
        [Fact]
        [Trait("Category", "UnitTest")]
        public void UpdateUserPreferenceForProvidedUserPreference()
        {
            //Arrange
            var userPrefId = Guid.Parse("FFA47F13-3ACA-4457-AC26-D2B2A14C1E11");

            var userPref = new UserPreferences()
            {
                BuckyProfile = new Entities.Bucky.BuckyProfile(),
                BuckyProfileID = Guid.NewGuid(),
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };

            _userPreferencesRepo.Insert(userPref);

            userPref.BuckyProfileID = Guid.Empty;
            userPref.BuckyProfile = null;
            //Act
            var result = _userPreferencesRepo.Update(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = _userPreferencesRepo.GetById(userPrefId);

            result.ShouldBeTrue();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldContain(userPref);
            Assert.True(userFound.Id == userPrefId);
            Assert.True(userFound.BuckyProfileID == Guid.Empty);
            userPref.BuckyProfile.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void NotUpdateUserPreferenceFoUnknownUserPreference()
        {
            //Arrange
            var userPrefId = Guid.Parse("77ED0629-838D-4FE2-A5D1-966B9F8A7439");

            var userPref = new UserPreferences()
            {
                BuckyProfile = new Entities.Bucky.BuckyProfile(),
                BuckyProfileID = Guid.NewGuid(),
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };


            userPref.BuckyProfileID = Guid.Empty;
            userPref.BuckyProfile = null;
            //Act
            var result = _userPreferencesRepo.Update(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = _userPreferencesRepo.GetById(userPrefId);

            result.ShouldBeFalse();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldNotContain(userPref);
            userFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void DeleteUserPreferenceWithProvidedID()
        {
            //Arrange
            var userPrefId = Guid.Parse("A1855DFE-C302-4E36-A738-5D93067B0586");

            var userPref = new UserPreferences()
            {
                BuckyProfile = new Entities.Bucky.BuckyProfile(),
                BuckyProfileID = Guid.NewGuid(),
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };

            _userPreferencesRepo.Insert(userPref);

            //Act
            _userPreferencesRepo.Delete(userPrefId);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = _userPreferencesRepo.GetById(userPrefId);

            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldNotContain(userPref);
            userFound.ShouldBeNull();
        }
    }
}
