using System;
using System.IO;
using System.Drawing;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Azure;

namespace Barn.AzIntegration
{
    public class BlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private static BlobService _instance = null;

        public static BlobService Instance(string connectionString)
        {
            if (_instance != null)
                return _instance;
            else
            {
                _instance = new BlobService(connectionString);
                return _instance;
            }
        }

        private BlobService(string connectionString)
        {
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        public async Task<byte[]> GetBlobAsync(string container, string blobName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(container);

            var blobClient = containerClient.GetBlobClient(blobName);

            if (!blobClient.Exists())
            {
                throw new FileNotFoundException($"Blob does not exist at {container}/{blobName}");
            }

            using (MemoryStream stream = new MemoryStream())
            {
                await blobClient.DownloadToAsync(stream);

                return stream.ToArray();
            }
        }
    }
}
