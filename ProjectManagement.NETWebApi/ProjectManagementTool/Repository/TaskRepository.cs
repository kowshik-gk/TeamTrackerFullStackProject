using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Responses;
using Microsoft.EntityFrameworkCore;

namespace ProjectManagementTool.Repository
{
    public class TaskRepository : ITaskService
    {
        private readonly PostgresContext _postgresContext;

        public TaskRepository(PostgresContext postgresContext)
        {
            _postgresContext = postgresContext;
        }

        public async Task<ActionResult> AddTaskByTeamLeader(Tasks task)
        {
            var EmpAlocated = await _postgresContext.Employee.FindAsync(task.AssigningEmployeeId);

            if (!(EmpAlocated.TaskId.Equals('0')) && (EmpAlocated.TaskId) != null)
            {
                return new BadRequestObjectResult("Employee is Handling Another Task");
            }

            var proj = await _postgresContext.Project.FindAsync(task.ProjectId);
            var NoofTaskInproj = proj.NumberOfTasks;

            var noOfTasksAssignedForThisProject = _postgresContext.Task
                .Where(t => t.ProjectId == proj.ProjectId)
                .Count();

            if (NoofTaskInproj <= noOfTasksAssignedForThisProject)
            {
                return new BadRequestObjectResult("Already All tasks assigned for this project");
            }

            if (task.DueDate.HasValue)
            {
                var utcDueDate = TimeZoneInfo.ConvertTimeToUtc(task.DueDate.Value);
                task.DueDate = utcDueDate;
            }

            await _postgresContext.Task.AddAsync(task);
            await _postgresContext.SaveChangesAsync();

            var newTaskId = task.TaskId;

            var employee = await _postgresContext.Employee.FindAsync(task.AssigningEmployeeId);
            if (employee != null)
            {
                employee.TaskId = newTaskId;
                _postgresContext.Employee.Update(employee);
                await _postgresContext.SaveChangesAsync();
            }

            return new OkResult();
        }

        public async Task<ActionResult> ReportTaskCompletionByEmployee(Guid employeeId, Guid taskId)
        {
            var emp = await _postgresContext.Employee.FindAsync(employeeId);

            if (emp == null || emp.TaskId == null)
            {
                return new BadRequestObjectResult("You are  not Working on any Task");
            }

            if (emp.TaskId != taskId)
            {
                return new BadRequestObjectResult("You are not working on this Task, Enter Valid Task ID");
            }

            var task = await _postgresContext.Task.FindAsync(taskId);
            if (task == null)
            {
                return new BadRequestObjectResult("Task not found.");
            }

            emp.TaskId = null;
            _postgresContext.Employee.Update(emp);
            await _postgresContext.SaveChangesAsync();

            var proj = await _postgresContext.Project.FindAsync(task.ProjectId);

            if (proj != null)
            {
                try
                {
                    if (proj.DueDate.HasValue)
                    {
                        var utcDueDate = TimeZoneInfo.ConvertTimeToUtc(proj.DueDate.Value);
                        proj.DueDate = utcDueDate;
                    }

                    proj.CompletedTasks += 1;
                    _postgresContext.Project.Update(proj);
                    await _postgresContext.SaveChangesAsync();
                }
                catch (Exception ex) { }
            }

            if (task.TaskStatus == 0)
            {
                if (task.DueDate.HasValue)
                {
                    var utcDueDate = TimeZoneInfo.ConvertTimeToUtc(task.DueDate.Value);
                    task.DueDate = utcDueDate;
                }
                task.TaskStatus = 1;
                _postgresContext.Task.Update(task);
                await _postgresContext.SaveChangesAsync();
            }

            return new OkObjectResult("Task completed successfully.");
        }

        public async Task<List<Tasks>> GetTasksByProjectId(int projectId)
        {
            return await _postgresContext.Task
                .Where(tasks => tasks.ProjectId.Equals(projectId))
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetCompletedTasksByProjectId(int projectId)
        {
            return await _postgresContext.Task
                .Where(tasks => tasks.ProjectId.Equals(projectId))
                .ToListAsync();
        }

        public async Task<List<Tasks>> GetInCompletedTasksBtProjectId(int projectId)
        {
            return await _postgresContext.Task
                .Where(tasks => tasks.ProjectId.Equals(projectId) && tasks.TaskStatus == 1)
                .ToListAsync();
        }
        public async Task<IEnumerable<TasksResp>> GetTasksAssignedByTL(string TLid)
        {
            var tasks = await _postgresContext.Task
                .Where(p => p.CreatedTeamLeader.Equals(new Guid(TLid)))
                .ToListAsync();

            List<TasksResp> result = new List<TasksResp>();
            foreach (var task in tasks)
            {
                string employeeName = await _postgresContext.Employee.Where(t => t.EmployeeId == task.AssigningEmployeeId).Select(t => t.EmployeeName).FirstOrDefaultAsync();

                string projectName = await _postgresContext.Project
                .Where(proj => proj.ProjectId == task.ProjectId)
                .Select(proj => proj.Name)
                .SingleOrDefaultAsync() ?? "Not Found";

                TasksResp responseEmp = new TasksResp(
                    task.AssigningEmployeeId ?? Guid.Empty,
                    employeeName,
                    task.TaskName ?? "Not Found",
                    projectName,
                    task.ProjectId ?? Guid.Empty,
                    "null"
                );
                responseEmp.DueDate = task.DueDate ?? DateTime.MinValue;
                responseEmp.TaskStatus = task.TaskStatus ?? 0;

                result.Add(responseEmp);
            }
            return result;
        }


        public async Task<TasksResp> GetTasksAssignedForEmployee(string EmpId)
        {
            TasksResp result = new TasksResp();
            try
            {
                var empObj = await _postgresContext.Employee.Where(t => t.EmployeeId.Equals(new Guid(EmpId))).FirstOrDefaultAsync();
                var taskofEmplyee = await _postgresContext.Task.Where(t => t.TaskId.Equals(empObj.TaskId)).FirstOrDefaultAsync();

                if (taskofEmplyee != null)
                {
                    result = new TasksResp(taskofEmplyee.TaskId, empObj.EmployeeName, taskofEmplyee.TaskName, "not found", taskofEmplyee.ProjectId??Guid.Empty,"null");

                    result.TaskId = taskofEmplyee.TaskId;

                    result.CreatedTL = await _postgresContext.TeamLeader.Where(t => t.TeamLeaderId == taskofEmplyee.CreatedTeamLeader).Select(t => t.TeamLeaderName).FirstOrDefaultAsync();
                }

            }
            catch (Exception ex) { }
            return result;
        }



    }
}
