using System;
using System.Threading.Tasks;
using Barn.Entities;

namespace Barn.AzIntegration.BuckyBehaviour
{
    public class BehaviourClient
    {
        private BlobService _blobService;
        public BehaviourClient(string connectionString)
        {
            _blobService = BlobService.Instance(connectionString);
        }

        public async Task<BehaviourBlob> GetBehaviourBlob(Entities.BuckyBehaviour behaviour)
        {
            var blobbytes = await _blobService.GetBlobAsync(behaviour.BuckyProfile.Name,
                Enum.GetName(typeof(ActionType), behaviour.ActionType));

            return new BehaviourBlob()
            {
                ActionType = behaviour.ActionType,
                Image = blobbytes,
            };
        }
    }
}
