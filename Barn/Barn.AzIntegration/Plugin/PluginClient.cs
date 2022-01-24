using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.AzIntegration.Plugin
{
    public class PluginClient
    {
        private BlobService _blobService;
        private const string CONTAINER_NAME = "plugins";
        public PluginClient(string connectionString)
        {
            _blobService = BlobService.Instance(connectionString);
        }

        public async Task<PluginBlob> GetPluginPackageBlob(Barn.Entities.Plugins.Plugin plugin)
        {
            var blobZipbytes = await _blobService.GetBlobAsync(CONTAINER_NAME, 
                plugin.Name.ToLowerInvariant() + "/" + plugin.Version + ".zip");

            return new PluginBlob()
            {
                ZipBytes = blobZipbytes
            };
        }

        public async Task<PluginImagesBlob> GetPluginImagesBlob(Barn.Entities.Plugins.Plugin plugin)
        {
            var icoBytes = await _blobService.GetBlobAsync(CONTAINER_NAME,
                plugin.Name.ToLowerInvariant() + "/" + "ico.ico");

            var svgBytes = await _blobService.GetBlobAsync(CONTAINER_NAME,
                plugin.Name.ToLowerInvariant() + "/" + "svg.svg");

            var pngBytes = await _blobService.GetBlobAsync(CONTAINER_NAME,
                plugin.Name.ToLowerInvariant() + "/" + "png.png");

            return new PluginImagesBlob()
            {
                IcoBytes = icoBytes,
                PngBytes = pngBytes,
                SvgBytes = svgBytes
            };
        }
    }
}
