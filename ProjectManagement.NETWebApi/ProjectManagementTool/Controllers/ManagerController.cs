using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.DTO;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;

namespace ProjectManagementTool.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManagerController : Controller
    {
        private readonly IManagerServices _managerService;

        public ManagerController(IManagerServices managerService)
        {
            _managerService = managerService;
        }

        // POST: api/Project/SignUp-Manager
        [HttpPost("SignUp-Manager")]
        public async Task<ReturnWarningMessage> PostManager(Manager manager)
        {
            // Await the asynchronous method
            if (await _managerService.IsUserAlreadyExits(manager))
            {
                return new ReturnWarningMessage("UserName Exists. Try Another UserName.",false);
            }

            if (ModelState.IsValid)
            {
                 await _managerService.PostManager(manager);
            }

            return new ReturnWarningMessage("SignUp Successfull ,Login to Continue",true);
        }


    }
}
