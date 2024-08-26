using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Domain.Services
{
    public interface IProjectService
    {
        Task<ActionResult> AddProjectByManager(Project proj);
        Task<ActionResult> ReportProjectCompletionByTeamLeader(Guid teamLeaderId, Guid projectId);
        Task<List<ProjectRes>> GetCompletedProjects();
        Task<List<ProjectRes>> GetIncompletedProjects();
        Task<List<ProjectRes>> GetProjectsAssignedBYByManager(string managerId);
        Task<List<ProjectRes>> GetProjectsAssignedForTeamLead(string TLid, bool PostState, bool IsView);
    }
}
