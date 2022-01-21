using Barn.API.Models;
using Barn.Services.Plugins;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Abstractions;
using System.Net;
using Swashbuckle.AspNetCore.Annotations;
using AutoMapper;

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
    }
}
