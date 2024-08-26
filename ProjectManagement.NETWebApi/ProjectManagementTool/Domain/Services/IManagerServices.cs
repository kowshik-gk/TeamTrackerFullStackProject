using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;

namespace ProjectManagementTool.Domain.Services
{
    public interface IManagerServices
    {
        Task<bool> IsUserAlreadyExits(Manager manager);
        Task<ActionResult> PostManager(Manager manager);
    }
}
