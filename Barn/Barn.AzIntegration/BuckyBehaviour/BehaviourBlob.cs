using System.Net.Mime;
using System.Security.Cryptography;
using Barn.Entities;
using Barn.Entities.Bucky;

namespace Barn.AzIntegration.BuckyBehaviour
{
    public class BehaviourBlob
    {
        public ActionType ActionType { get; set; }
        public byte[] Image { get; set; }

    }
}
