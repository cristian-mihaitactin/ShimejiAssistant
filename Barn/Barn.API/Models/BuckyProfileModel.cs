using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Barn.API.Models
{
    public class BuckyProfileModel
    {
        public Guid Id { get; set; }
        private List<BuckyBehaviourModel> _behaviours;
        public IList<BuckyBehaviourModel> Behaviours => _behaviours;
    }
}
