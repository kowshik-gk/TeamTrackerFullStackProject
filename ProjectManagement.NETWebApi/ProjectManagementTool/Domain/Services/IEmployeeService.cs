using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Repository
{
    public interface IEmployeeService
    {
        Task<ActionResult> PostEmployee(Employee employee);

        Task<List<TasksResp>> GetWorkingEmployee();

        Task<List<TasksResp>> GetNonWorkingEmployee();

        Task<EmployeeResponse> GetEmployeeByName(string employeeUserName);
        Task<bool> IsUserAlreadyExits(Employee employee);
    }
}
