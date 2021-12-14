using System;
using System.Collections.Generic;

namespace Barn.Entities.Bucky
{
    public class BuckyProfile: EntityWithRowVersion
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<BuckyBehaviour> Behaviours { get; set; }
    }
}
