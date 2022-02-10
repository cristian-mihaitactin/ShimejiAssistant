using Barn.Data.EF;
using Barn.Data.EF.Repoes;
using Barn.Entities.Bucky;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Collections.Generic;
using Xunit;

namespace Barn.Tests.Data
{
    public class BuckyProfileShould
    {
        private BuckyProfileRepo _buckyProfileRepo;
        private static ApplicationDbContext _context = null;


        private static Guid buckyId1 = Guid.Parse("5C805BCC-728A-46D2-AEB8-16175D78B038");
        private static Guid buckyId2 = Guid.Parse("D9A28007-68AF-4BFB-8F51-901FFA6E2C7F");
        private static Guid buckyId3 = Guid.Parse("85C5A899-74A7-46A5-84FA-2A84E908458F");

        private static List<BuckyBehaviour> _buckyBehaviourList = new List<BuckyBehaviour>(new BuckyBehaviour[] {
            new BuckyBehaviour()
            {
                BuckyProfileId = buckyId1,
                Id = Guid.NewGuid()
            },
            new BuckyBehaviour()
            {
                BuckyProfileId = buckyId2,
                Id = Guid.NewGuid()
            },
            new BuckyBehaviour()
            {
                BuckyProfileId = buckyId3,
                Id = Guid.NewGuid()
            }
            });

        private static List<BuckyProfile> _buckyProfileList = new List<BuckyProfile>(new BuckyProfile[] {
            new BuckyProfile()
            {
                Id = buckyId1,
                Name = "buckyProfile1",
                Description ="This is buckyProfile1",
                Behaviours = new List<BuckyBehaviour>( new BuckyBehaviour[]{_buckyBehaviourList[0]})
            },
            new BuckyProfile()
            {
                Id = buckyId2,
                Name = "buckyProfile2",
                Description ="This is buckyProfile2",
                Behaviours = new List<BuckyBehaviour>( new BuckyBehaviour[]{_buckyBehaviourList[1]})

            },
            new BuckyProfile()
            {
                Id = buckyId3,
                Name = "buckyProfile3",
                Description ="This is buckyProfile3",
                Behaviours = new List<BuckyBehaviour>( new BuckyBehaviour[]{_buckyBehaviourList[2]})
            },
        });

        private static ApplicationDbContext DbContext
        {
            get
            {
                if (_context == null)
                {
                    var builder = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseInMemoryDatabase("Bucky-test-buckyProfiles");

                    _context = new ApplicationDbContext(builder.Options);

                    _context.BuckyProfiles.AddRange(_buckyProfileList);
                    int changed = _context.SaveChanges();

                }

                return _context;
            }
        }

        public BuckyProfileShould()
        {
            _buckyProfileRepo = new BuckyProfileRepo(DbContext);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnAllBuckyProfile()
        {
            //Arrange

            //Act
            var result = _buckyProfileRepo.GetAll();

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void InsertBuckyProfile()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("18517671-D85A-49C7-8B8D-C2B3901D9CC0");

            var buckyProfile = new BuckyProfile()
            {
                Id = buckyProfileId,
                Name = "insertedBuckyProfile",
                Description = "This is insertedBuckyProfile",
                Behaviours = null
            };

            //Act
            var result = _buckyProfileRepo.Insert(buckyProfile);

            //Assert
            var buckyProfileListResult = _buckyProfileRepo.GetAll();
            var buckyFound = _buckyProfileRepo.GetById(buckyProfileId);

            result.ShouldBeTrue();
            buckyProfileListResult.ShouldNotBeNull();
            buckyProfileListResult.ShouldContain(buckyProfile);
            Assert.True(buckyFound.Id == buckyProfileId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnBuckyProfileFoGivenId()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("1040AE1F-F89F-4D40-8A6D-267765B678A7");

            var buckyProfile = new BuckyProfile()
            {
                Id = buckyProfileId,
                Name = "GET",
                Description = "This is GET profile",
                Behaviours = null
            };

            _buckyProfileRepo.Insert(buckyProfile);

            //Act
            var result = _buckyProfileRepo.GetById(buckyProfileId);

            //Assert
            result.ShouldNotBeNull();
            Assert.True(result.Id == buckyProfileId);
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void ReturnNullForUnknownId()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("6BA70A5F-6601-4EDA-8355-42A8F0397E69");

            //Act
            var result = _buckyProfileRepo.GetById(buckyProfileId);

            //Assert
            result.ShouldBeNull();
        }


        [Fact]
        [Trait("Category", "UnitTest")]
        public void UpdateBuckyProfileForProvidedBuckyProfile()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("528DD977-ED9E-49FD-9582-AE2BF11054DA");

            var buckyProfile = new BuckyProfile()
            {
                Id = buckyProfileId,
                Name = "insertedBuckyProfile",
                Description = "This is insertedBuckyProfile",
                Behaviours = null
            };

            _buckyProfileRepo.Insert(buckyProfile);

            buckyProfile.Name = "Updated BuckyProfile";
            buckyProfile.Description = "This is Updated BuckyProfile";
            //Act
            var result = _buckyProfileRepo.Update(buckyProfile);

            //Assert
            var buckyProfileListResult = _buckyProfileRepo.GetAll();
            var buckyProfileResult = _buckyProfileRepo.GetById(buckyProfileId);

            result.ShouldBeTrue();
            buckyProfileListResult.ShouldNotBeNull();
            buckyProfileListResult.ShouldContain(buckyProfile);
            Assert.True(buckyProfileResult.Id == buckyProfileId);
            Assert.True(buckyProfileResult.Name == "Updated BuckyProfile");
            Assert.True(buckyProfileResult.Description == "This is Updated BuckyProfile");
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void NotUpdateBuckyProfileFoUnknownBuckyProfile()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("4E07CD0E-4EA5-4C04-AEF1-83BD7C1EF854");

            var buckyProfile = new BuckyProfile()
            {
                Id = buckyProfileId,
                Name = "Does not exist",
                Description = "This profile does not exist",
                Behaviours = null
            };

            //Act
            var result = _buckyProfileRepo.Update(buckyProfile);

            //Assert
            var buckyProfileListResult = _buckyProfileRepo.GetAll();
            var buckyFound = _buckyProfileRepo.GetById(buckyProfileId);

            result.ShouldBeFalse();
            buckyProfileListResult.ShouldNotBeNull();
            buckyProfileListResult.ShouldNotContain(buckyProfile);
            buckyFound.ShouldBeNull();
        }

        [Fact]
        [Trait("Category", "UnitTest")]
        public void DeleteBuckyProfileWithProvidedID()
        {
            //Arrange
            var buckyProfileId = Guid.Parse("93063803-60E1-4B63-B095-2670922808AF");

            var buckyProfile = new BuckyProfile()
            {
                Id = buckyProfileId,
                Name = "Delete ME",
                Description = "I need to be deleted",
                Behaviours = null
            };

            _buckyProfileRepo.Insert(buckyProfile);

            //Act
            _buckyProfileRepo.Delete(buckyProfileId);

            //Assert
            var buckyProfileListResult = _buckyProfileRepo.GetAll();
            var buckyFound = _buckyProfileRepo.GetById(buckyProfileId);

            buckyProfileListResult.ShouldNotBeNull();
            buckyProfileListResult.ShouldNotContain(buckyProfile);
            buckyFound.ShouldBeNull();
        }
    }
}
