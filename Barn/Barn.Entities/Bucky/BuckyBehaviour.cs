using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Entities
{
    public class BuckyBehaviour
    {

        public Guid Id { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public ActionType ActionType { get; private set; }
        public string ImageBlobPath { get; private set; }

        public BuckyBehaviour(Guid id, string name, string description, ActionType actionType, string imageBlobPath)
        {
            Id = id;
            Name = name;
            Description = description;
            ActionType = actionType;
            ImageBlobPath = imageBlobPath;
        }
    }
}
