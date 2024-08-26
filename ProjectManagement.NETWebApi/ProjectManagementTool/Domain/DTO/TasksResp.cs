using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Responses
{
    public class TasksResp
    {
        public Guid EmployeeId { get; set; }

        public string EmployeeName { get; set; }

        public Guid TaskId { get; set; }
        public string TaskName { get; set; }

        public string ProjectName { get; set; }

        public Guid ProjectId { get; set; }

        public DateTime DueDate { get; set; }

        public int TaskStatus { get; set; }

        public string CreatedTL { get; set; }

        public TasksResp(Guid employeeId,string employeeName, string taskName, string projectName,Guid projectId,string createdTL)
        {
            EmployeeId = employeeId;
            EmployeeName = employeeName;
            TaskName = taskName;
            ProjectName = projectName;
            ProjectId = projectId;
            CreatedTL = createdTL;
        }

        public TasksResp() { }


    }
}
