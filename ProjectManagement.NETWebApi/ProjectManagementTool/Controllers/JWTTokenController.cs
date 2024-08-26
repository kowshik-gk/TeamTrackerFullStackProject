using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Models; // Assuming LoginModel is defined here
using ProjectManagementTool.Domain.Services;

namespace ProjectManagementTool.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JWTTokenController : ControllerBase
    {
        private readonly IAuthenticationServices _authentication;

        public JWTTokenController(IAuthenticationServices authentication)
        {
            _authentication = authentication;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var token = _authentication.Authenticate(model.Username, model.Password);

            if (token == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            return Ok(token);
        }
    }

    public class LoginModel
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
