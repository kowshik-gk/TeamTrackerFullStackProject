using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.DTO;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Repository;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        private IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        [HttpPost("SignUp-Employee")]
        public async Task<ReturnWarningMessage> PostEmployee(Employee employee)
        {
            if (await _employeeService.IsUserAlreadyExits(employee))
            {
                return new ReturnWarningMessage("UserName Exists. Try Another UserName.", false);
            }
            if (ModelState.IsValid)
            {
                 await _employeeService.PostEmployee(employee);
            }
            return new ReturnWarningMessage("SignUp Successfull ,Login to Continue", true);
        }

        [HttpGet("Working-Employee")]
        public async Task<ActionResult<List<TLResp>>> GetWorkingEmployee()
        {
            var employees = await _employeeService.GetWorkingEmployee();
            return Ok(employees);
        }

        [HttpGet("Non-Working-Employee")]
        public async Task<ActionResult<List<TasksResp>>> GetNonWorkingEmployee()
        {
            var employees = await _employeeService.GetNonWorkingEmployee();
            return Ok(employees);
        }

        [HttpGet("GetEmployeeByUserName")]
        public async Task<ActionResult<EmployeeResponse>> GetEmployeeByName(string employeeUserName)
        {
            var tasks = await _employeeService.GetEmployeeByName(employeeUserName);

            if (tasks == null)
            {
                return NotFound();
            }

            return Ok(tasks);

        }
    }
}
