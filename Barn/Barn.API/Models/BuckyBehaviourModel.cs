using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Entities.Bucky;

namespace Barn.API.Models
{
    public class BuckyBehaviourModel
    {
        public ActionType ActionType { get; set; }
        public byte[] ImageBytes { get; set; }
    }
}
