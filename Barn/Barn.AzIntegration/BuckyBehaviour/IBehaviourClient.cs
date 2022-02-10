using System.Threading.Tasks;

namespace Barn.AzIntegration.BuckyBehaviour
{
    public interface IBehaviourClient
    {
        Task<BehaviourBlob> GetBehaviourBlob(Entities.Bucky.BuckyBehaviour behaviour);
    }
}