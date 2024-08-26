using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Responses;
using Microsoft.EntityFrameworkCore;

namespace ProjectManagementTool.Repository
{
    public class EmployeeRepository:IEmployeeService
    {
        private readonly PostgresContext _postgresDbContext;

        public EmployeeRepository(PostgresContext postgresContext)
        {
            _postgresDbContext = postgresContext;
        } 
        public async Task<ActionResult> PostEmployee(Employee employee)
        {
            employee.TaskId = null;
            employee.EmployeeId = Guid.NewGuid();
            await _postgresDbContext.Employee.AddAsync(employee);
            await _postgresDbContext.SaveChangesAsync();
            return new OkResult();
        }
        public async Task<bool> IsUserAlreadyExits(Employee employee)
        {
            return await _postgresDbContext.Manager
                .AnyAsync(t => t.ManagerName.Equals(employee.EmployeeName));
        }

        public async Task<List<TasksResp>> GetWorkingEmployee()
        {
            var empList = await _postgresDbContext.Employee
                .Where(emp => !emp.TaskId.Equals("0") && emp.TaskId != null)
                .ToListAsync();

            var result = new List<TasksResp>();

            foreach (var emp in empList)
            {
                var workingTask = await _postgresDbContext.Task
                .Where(task => task.TaskId == emp.TaskId)
                .SingleOrDefaultAsync();

                var projectId = workingTask.ProjectId;

                var workingProject= await _postgresDbContext.Project
                 .Where(proj => proj.ProjectId == projectId)
                 .SingleOrDefaultAsync();

                var createdTeamLeadName = await _postgresDbContext.TeamLeader.Where(t=>t.TeamLeaderId==workingTask.CreatedTeamLeader).Select(t=>t.TeamLeaderName).FirstOrDefaultAsync();

                var responseEmp = new TasksResp(emp.EmployeeId, emp.EmployeeName, workingTask.TaskName, workingProject.Name, projectId??Guid.Empty,createdTeamLeadName);
                result.Add(responseEmp);
            }
            return result;
        }

        public async Task<List<TasksResp>> GetNonWorkingEmployee()
        {
            var empList = await _postgresDbContext.Employee
             .Where(emp => emp.TaskId.Equals("0") || emp.TaskId == null)
                .ToListAsync();

            var result = new List<TasksResp>();

            foreach (var emp in empList)
            {
                var responseEmp = new TasksResp(emp.EmployeeId, emp.EmployeeName, "No Tasks were assigned", "No Tasks were Assigned", Guid.Empty,"null");
                result.Add(responseEmp);
            }
            return result;
        }
        public async Task<EmployeeResponse> GetEmployeeByName(string employeeUserName)
        {
            var empEntityResult = await _postgresDbContext.Employee.Where(t => t.EmployeeName == employeeUserName).FirstOrDefaultAsync();

            var workingTask= await _postgresDbContext.Task.Where(t=>t.TaskName.Equals(empEntityResult.TaskId)).FirstOrDefaultAsync();



            var workingProject = await _postgresDbContext.Project
                .Where(proj => proj.ProjectId == workingTask.ProjectId)
                .SingleOrDefaultAsync();

            if(workingTask == null || workingProject == null)
            {
                return new EmployeeResponse(employeeUserName,"Not Found","Not Found");
            }

            return new EmployeeResponse(employeeUserName, workingTask.TaskName, workingProject.Name);
        }
    }
}
