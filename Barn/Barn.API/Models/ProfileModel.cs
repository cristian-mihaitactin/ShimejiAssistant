using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Barn.API.Models
{
    public class ProfileModel
    {
        public Guid Id { get; set; }
        private List<BehaviourModel> _behaviours;
        public IList<BehaviourModel> Behaviours => _behaviours;
    }
}
