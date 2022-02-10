using Barn.AzIntegration.BuckyBehaviour;
using Barn.Entities.Bucky;
using Barn.Services.BuckyProfile;
using Barn.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Barn.Tests.Services
{
    public class BuckyProfileServiceShould
    {
        [Fact]
        [Trait("Category", "Unit")]
        public async Task ReturnCorrectCorrectBehaviourBlobs()
        {
            //Arrange
            var buckyId1 = Guid.NewGuid();

            var buckyProf = new BuckyProfile()
            {
                Id = buckyId1,
                Name = "buckyProfile1",
                Description = "This is buckyProfile1 for BuckyProfileServiceShould",
                Behaviours = new List<BuckyBehaviour>(new BuckyBehaviour[] {
                    new BuckyBehaviour()
                    {
                        BuckyProfileId = buckyId1,
                        Id = Guid.NewGuid(),
                        ActionType = ActionType.Attention,
                        Name = "Test behaviour for attention"
                    }
                })
            };

            var repoMock = new Mock<IGenericRepo<Guid,Entities.Bucky.BuckyProfile>>();
            repoMock.Setup(r => r.GetAsyncById(It.IsAny<Guid>())).ReturnsAsync(buckyProf);

            var behaviourClientMock = new Mock<IBehaviourClient>();
            
            var byteArray = Encoding.ASCII.GetBytes("Shhh! I am byte");
            var behaviourBlob = new BehaviourBlob()
            {
                ActionType = ActionType.Attention,
                Image = byteArray

            };
            behaviourClientMock.Setup(b => b.GetBehaviourBlob(It.IsAny<BuckyBehaviour>())).ReturnsAsync(behaviourBlob);

            var buckyProfileService = new BuckyProfileService(repoMock.Object, behaviourClientMock.Object);

            //Act
            var result = await buckyProfileService.GetProfile(buckyId1);

            //Assert
            result.ShouldNotBeNull();
            result.Behaviours.ShouldNotBeNull();
            result.Behaviours[0].ShouldNotBeNull();
            Assert.Equal(ActionType.Attention, result.Behaviours[0].ActionType);
            Assert.Equal(byteArray, result.Behaviours[0].ImageBytes);
        }
    }
}
