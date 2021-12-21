using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Services.BuckyProfile;

namespace Barn.API.Models
{
    public class BuckyProfileModel
    {
        public Guid Id { get; set; }
        public IList<BuckyBehaviourModel> Behaviours { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
