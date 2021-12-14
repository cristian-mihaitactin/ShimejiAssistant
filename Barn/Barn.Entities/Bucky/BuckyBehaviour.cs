using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Entities
{
    public class BuckyBehaviour: EntityWithRowVersion
    {

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ActionType ActionType { get; set; }
        public string ImageBlobPath { get; set; }
        public BuckyProfile BuckyProfile { get; set; }
        public Guid BuckyProfileId { get; set; }
    }
}
