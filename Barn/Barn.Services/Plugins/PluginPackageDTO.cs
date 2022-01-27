using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Services.Plugins
{
    public class PluginPackageDTO
    {
        public string FileName { get; set; }
        public byte[] ZipBytes { get; set; }
        public string Version { get; set; }
        public string Name { get; set; }
    }
}
