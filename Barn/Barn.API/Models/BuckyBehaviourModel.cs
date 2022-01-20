using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Barn.Entities.Bucky;
using Barn.Services.BuckyProfile;

namespace Barn.API.Models
{
    public class BuckyBehaviourModel
    {
        private ActionType _actionType;

        public BuckyBehaviourModel(BuckyBehaviourDTO b)
        {
            this._actionType = b.ActionType;
            this.ImageBytes = b.ImageBytes;
        }
        public BuckyBehaviourModel()
        {
        }

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
