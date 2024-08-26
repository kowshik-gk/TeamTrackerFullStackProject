using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Domain.Services
{
    public interface ITaskService
    {
        Task<ActionResult> AddTaskByTeamLeader(Tasks task);
        Task<ActionResult> ReportTaskCompletionByEmployee(Guid employeeId, Guid taskId);
        Task<List<Tasks>> GetTasksByProjectId(int projectId);
        Task<List<Tasks>> GetCompletedTasksByProjectId(int projectId);
        Task<List<Tasks>> GetInCompletedTasksBtProjectId(int projectId);
        Task<IEnumerable<TasksResp>> GetTasksAssignedByTL(string TLid);
        Task<TasksResp> GetTasksAssignedForEmployee(string EmpId);
    }
}
