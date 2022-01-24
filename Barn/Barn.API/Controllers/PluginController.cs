using Barn.API.Models;
using Barn.Services.Plugins;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Abstractions;
using System.Net;
using Swashbuckle.AspNetCore.Annotations;
using AutoMapper;
using System;

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PluginController : ControllerBase
    {
        IPluginService _pluginService;
        IMapper _mapper;

        public PluginController(IMapper mapper, IPluginService pluginService)
        {
            _mapper = mapper;
            _pluginService = pluginService;
        }

        [SwaggerResponse((int)HttpStatusCode.Accepted, "", typeof(PluginModel))]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_pluginService.GetPlugins().Select(p => _mapper.Map<PluginModel>(p)));
        }


        [SwaggerResponse((int)HttpStatusCode.Accepted, "", typeof(PluginPackageDTO))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, "Please review your request and try again")]
        [SwaggerResponse((int)HttpStatusCode.Unauthorized, "Please login and try again")]
        [SwaggerResponse((int)HttpStatusCode.NotFound, "Plugin not found. Please check the request")]
        [HttpGet("{id}/PluginPackage")]
        public async Task<IActionResult> GetPluginPackage(Guid id)
        {
            var package = await _pluginService.GetPluginPackageAsync(id);

            return Ok(package);
        }

        [SwaggerResponse((int)HttpStatusCode.Accepted, "", typeof(PluginDTO))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, "Please review your request and try again")]
        [SwaggerResponse((int)HttpStatusCode.Unauthorized, "Please login and try again")]
        [SwaggerResponse((int)HttpStatusCode.NotFound, "Plugin not found. Please check the request")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlugin(Guid id)
        {
            var plugin = await _pluginService.GetPluginWithImagesAsync(id);

            return Ok(plugin);
        }
    }
}
