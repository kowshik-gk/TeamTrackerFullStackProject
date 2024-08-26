using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Responses;
using System.Security.Claims;

namespace ProjectManagementTool.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {
        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        // POST: api/Project/Post-Project
        [Authorize(Roles = "manager")]
        [HttpPost("Post-Project")]
        public async Task<ActionResult> AddProjectByManager(Project proj)
        {
            proj.ProjectId = Guid.NewGuid();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"User role: {userRole}");

            if (userRole != "manager")
            {
                return Unauthorized("You are not authorized to create projects.");
            }

            if (ModelState.IsValid)
            {
                return await _projectService.AddProjectByManager(proj);
            }
            return BadRequest(ModelState);
        }

        [Authorize(Roles = "teamleader")]
        [HttpPut("Project-Completion")]
        public async Task<ActionResult> PutProject(Project project)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirst("UserId")?.Value;
                if (userId != null)
                {
                    Guid teamLeaderId = new Guid(userId.ToString());
                    return await _projectService.ReportProjectCompletionByTeamLeader(teamLeaderId, project.ProjectId);
                }
                return Unauthorized();
            }
            return BadRequest(ModelState);
        }

        [HttpGet("Get-Completed-Projects")]
        public async Task<ActionResult<List<ProjectRes>>> GetCompletedProjects()
        {
            var projects = await _projectService.GetCompletedProjects();
            return Ok(projects);
        }

        [HttpGet("Get-InCompleted-Projects")]
        public async Task<ActionResult<List<ProjectRes>>> GetIncompletedProjects()
        {
            var projects = await _projectService.GetIncompletedProjects();
            return Ok(projects);
        }
        [HttpGet("GetProjectsAssignedByManager/{managerId}")]
        public async Task<ActionResult<IEnumerable<ProjectRes>>> GetProjectsAssignedBYByManager(string managerId)
        {
            var projects = await _projectService.GetProjectsAssignedBYByManager(managerId);

            if (projects == null)
            {
                return NotFound();
            }

            return Ok(projects);
        }


        [HttpGet("GetProjectsAssignedForTeamLead/{teamLeaderId}")]
        public async Task<ActionResult<List<ProjectRes>>> GetProjectsAssignedForTeamLead(string teamLeaderId, bool PostState, bool IsView)
        {
            var projects = await _projectService.GetProjectsAssignedForTeamLead(teamLeaderId, PostState, IsView);

            if (projects == null)
            {
                return NotFound();
            }

            return Ok(projects);
        }

    }
}
