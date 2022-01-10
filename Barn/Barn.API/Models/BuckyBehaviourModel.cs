using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Entities.Bucky;

namespace Barn.API.Models
{
    public class BuckyBehaviourModel
    {
        private ActionType _actionType;
        public ActionType ActionType => _actionType;

        public string ActionTypeString
        {
            get
            {
                return _actionType.ToString();
            }
        }
        public byte[] ImageBytes { get; set; }
    }
}
