using Barn.Data.EF;
using Barn.Data.EF.Repoes;
using Barn.Data.Mock;
using Barn.Entities.Bucky;
using Barn.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Barn.Tests.Data
{
    public class UserPreferencesRepoShould
    {
        private UserPreferencesRepo _userPreferencesRepo;
        private static ApplicationDbContext _context = null;
        private static List<UserPreferences> _userPreferenceList = new List<UserPreferences>(new UserPreferences[] {
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
        public static ApplicationDbContext DbContext
        {
            get
            {
                if (_context == null)
                {
                    var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseInMemoryDatabase("Bucky-test-userPreferences");

                    _context = new ApplicationDbContext(builder.Options);

                    _context.UsersPreferences.AddRange(_userPreferenceList);
                    int changed = _context.SaveChanges();

                }

                return _context;
            }
            private set { _context = value; }
        }

        public UserPreferencesRepoShould()
        {
            _userPreferencesRepo = new UserPreferencesRepo(DbContext);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task ReturnAllUserPreferences()
        {
            //Arrange

            //Act
            var result = _userPreferencesRepo.GetAll();

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task InsertUserPreference()
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
            var result = await _userPreferencesRepo.InsertAsync(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = await _userPreferencesRepo.GetAsyncById(userPrefId);

            result.ShouldBeTrue();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldContain(userPref);
            Assert.True(userFound.Id == userPrefId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task ReturnUserPreferenceFoGivenId()
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

            await _userPreferencesRepo.InsertAsync(userPref);

            //Act
            var result = await _userPreferencesRepo.GetAsyncById(userPrefId);

            //Assert
            result.ShouldNotBeNull();
            Assert.True(result.Id == userPrefId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task ReturnNullForUnknownId()
        {
            //Arrange
            var userPrefId = Guid.Parse("254F75BA-8679-4049-B646-CCD32FCC9C1E");

            //Act
            var result = await _userPreferencesRepo.GetAsyncById(userPrefId);

            //Assert
            result.ShouldBeNull();
        }

        
        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task UpdateUserPreferenceForProvidedUserPreference()
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

            await _userPreferencesRepo.InsertAsync(userPref);

            userPref.BuckyProfileID = Guid.Empty;
            userPref.BuckyProfile = null;
            //Act
            var result = await _userPreferencesRepo.UpdateAsync(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = await _userPreferencesRepo.GetAsyncById(userPrefId);

            result.ShouldBeTrue();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldContain(userPref);
            Assert.True(userFound.Id == userPrefId);
            Assert.True(userFound.BuckyProfileID == Guid.Empty);
            userPref.BuckyProfile.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task NotUpdateUserPreferenceFoUnknownUserPreference()
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
            var result = await _userPreferencesRepo.UpdateAsync(userPref);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = await _userPreferencesRepo.GetAsyncById(userPrefId);

            result.ShouldBeFalse();
            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldNotContain(userPref);
            userFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public async Task DeleteUserPreferenceWithProvidedID()
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

            await _userPreferencesRepo.InsertAsync(userPref);

            //Act
            await _userPreferencesRepo.DeleteAsync(userPrefId);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = await _userPreferencesRepo.GetAsyncById(userPrefId);

            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldNotContain(userPref);
            userFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "Integration")]
        public async Task DeleteUserPreferenceWithBuckyProfileDoesNotDeleteBuckyProfile()
        {
            //Arrange
            var userPrefId = Guid.Parse("FB08B218-8289-4544-8D40-C3A5DF303556");
            var buckyProfileId = Guid.NewGuid();
            var buckyProfile = new Entities.Bucky.BuckyProfile()
            {
                Id = buckyProfileId,
                Behaviours = new List<BuckyBehaviour>(new BuckyBehaviour[] {
                        new BuckyBehaviour()
                        {
                            BuckyProfileId = buckyProfileId,
                            Id = Guid.NewGuid()
                        }
                    })
            };

            var userPref = new UserPreferences()
            {
                BuckyProfile = buckyProfile,
                Id = userPrefId,
                User = null,
                UserId = Guid.NewGuid(),
                UserPreferencesPlugins = null
            };
            var buckyProfileRepo = new BuckyProfileRepo(DbContext);

            await buckyProfileRepo.InsertAsync(buckyProfile);
            await _userPreferencesRepo.InsertAsync(userPref);

            //Act
            await _userPreferencesRepo.DeleteAsync(userPrefId);

            //Assert
            var userPrefListResult = _userPreferencesRepo.GetAll();
            var userFound = await _userPreferencesRepo.GetAsyncById(userPrefId);

            userPrefListResult.ShouldNotBeNull();
            userPrefListResult.ShouldNotContain(userPref);
            userFound.ShouldBeNull();

            var buckyProfileFound = await buckyProfileRepo.GetAsyncById(buckyProfileId);
            buckyProfileFound.ShouldNotBeNull();
        }
    }
}
