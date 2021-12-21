using System;
using System.Globalization;
using System.Threading.Tasks;
using Barn.Entities;
using Barn.Entities.Bucky;

namespace Barn.AzIntegration.BuckyBehaviour
{
    public class BehaviourClient
    {
        private BlobService _blobService;
        public BehaviourClient(string connectionString)
        {
            _blobService = BlobService.Instance(connectionString);
        }

        public async Task<BehaviourBlob> GetBehaviourBlob(Entities.Bucky.BuckyBehaviour behaviour)
        {
            var blobbytes = await _blobService.GetBlobAsync(behaviour.BuckyProfile.Name.ToLowerInvariant(),
                Enum.GetName(typeof(ActionType), behaviour.ActionType)?.ToLowerInvariant() + ".png");

            return new BehaviourBlob()
            {
                ActionType = behaviour.ActionType,
                Image = blobbytes,
            };
        }
    }
}
