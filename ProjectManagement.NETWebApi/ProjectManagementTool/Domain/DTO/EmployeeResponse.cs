using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Responses
{
    public class EmployeeResponse
    {
        public string EmployeeUserName { get; set; }

        public string WorkingTaskName { get; set; }

        public string WorkingProjectName { get; set; }

        public EmployeeResponse(string employeeUserName, string workingTaskName, string workingProjectName)
        {
            EmployeeUserName = employeeUserName;
            WorkingTaskName = workingTaskName;
            WorkingProjectName = workingProjectName;
        }
    }
}
