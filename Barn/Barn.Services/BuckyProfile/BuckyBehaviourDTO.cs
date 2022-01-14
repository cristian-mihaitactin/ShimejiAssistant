using Barn.Entities;
using Barn.Entities.Bucky;

namespace Barn.Services.BuckyProfile
{
    public class BuckyBehaviourDTO
    {
        private readonly BuckyBehaviour _buckyBehaviour;
        public BuckyBehaviour BuckyBehaviour => _buckyBehaviour;
        public ActionType ActionType => _buckyBehaviour.ActionType;

        public string ActionTypeString
        {
            get
            {
                return _buckyBehaviour.ActionType.ToString();
            }
        }
        public byte[] ImageBytes { get; set; }

        public BuckyBehaviourDTO(BuckyBehaviour buckyBehaviour)
        {
            _buckyBehaviour = buckyBehaviour;
        }
    }
}
