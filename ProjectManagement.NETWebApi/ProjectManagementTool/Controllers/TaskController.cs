using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Repository;
using ProjectManagementTool.Responses;
using System.Security.Claims;

namespace ProjectManagementTool.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : Controller
    {
        private readonly ITaskService _taskService;
        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [Authorize(Roles = "teamleader")]
        [HttpPost("Post-Task")]
        public async Task<ActionResult> AddTaskByTeamLeader(Tasks task)
        {
            task.TaskId = Guid.NewGuid();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"User role: {userRole}");

            if (userRole != "teamleader")
            {
                return Unauthorized("You are not authorized to create projects.");
            }
            if (ModelState.IsValid)
            {
                return await _taskService.AddTaskByTeamLeader(task);
            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "employee")]
        [HttpPut("Task-Completion")]
        public async Task<ActionResult> ReportTaskCompletionByEmployee(Tasks Task)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirst("UserId")?.Value;
                if (userId != null)
                {
                    return await _taskService.ReportTaskCompletionByEmployee(new Guid(userId), Task.TaskId);
                }
                return Unauthorized();
            }
            return BadRequest(ModelState);
        }

        [HttpGet("Get-Projects-Task")]
        public async Task<ActionResult<List<Tasks>>> GetTasksByProjectId(int projectId)
        {
            var tasks = await _taskService.GetTasksByProjectId(projectId);
            return Ok(tasks);
        }

        [HttpGet("Get-Projects-Completed-Task")]  
        public async Task<ActionResult<List<Tasks>>> GetCompletedTasksByProjectId(int projectId)
        {
            var tasks = await _taskService.GetCompletedTasksByProjectId(projectId);
            return Ok(tasks);
        }

        [HttpGet("Get-Projects-InCompleted-Task")]
        public async Task<ActionResult<List<Tasks>>> GetInCompletedTasksBtProjectId(int projectId) 
        {
            var tasks = await _taskService.GetInCompletedTasksBtProjectId(projectId);
            return Ok(tasks);
        }

        [HttpGet("GetTasksAssignedByTL/{teamLeaderId}")]
        public async Task<ActionResult<IEnumerable<TasksResp>>> GetTasksAssignedByTL(string teamLeaderId)
        {
            var tasks = await _taskService.GetTasksAssignedByTL(teamLeaderId);

            if (tasks == null)
            {
                return NotFound();
            }

            return Ok(tasks);
        }

        [HttpGet("GetTasksAssignedForEmployee/{employeeId}")]

        public async Task<ActionResult<TasksResp>> GetTasksAssignedForEmployee(string employeeId)
        {
            var tasks = await _taskService.GetTasksAssignedForEmployee(employeeId);

            if (tasks == null)
            {
                return NotFound();
            }

            return Ok(tasks);

        }
    }
}
