using Barn.Entities;
using Barn.Entities.Bucky;

namespace Barn.Services.BuckyProfile
{
    public class Behaviour
    {
        private readonly BuckyBehaviour _buckyBehaviour;
        public BuckyBehaviour BuckyBehaviour => _buckyBehaviour;
        public ActionType ActionType => _buckyBehaviour.ActionType;

        public byte[] ImageBytes { get; set; }

        public Behaviour(BuckyBehaviour buckyBehaviour)
        {
            _buckyBehaviour = buckyBehaviour;
        }
    }
}
