using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Entities
{
    public abstract class EntityWithRowVersion
    {
        public byte[] RowVersion { get; set; }

    }
}
