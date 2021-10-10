using Barn.API.Models;
using Barn.Services.User;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Barn.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        IUserService _userService; 
        
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/<UserController>
        //[HttpGet]
        //public IEnumerable<UserModel> Get()
        //{
        //    return _userService.GetAll();
        //}

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public UserModel Get(Guid id)
        {
            return new UserModel(_userService.GetUserById(id));
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post([FromBody] UserModel value)
        {
            _userService.CreateUser(value.ToEntity());
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(Guid id, [FromBody] UserModel value)
        {
            _userService.UpdateUser(value.ToEntity());
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(Guid id)
        {
            _userService.DeleteUser(id);
        }
    }
}
