using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.DTO;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Models;
using ProjectManagementTool.Domain.Services;

namespace ProjectManagementTool.Repository
{
    public class ManagerRepository : IManagerServices
    {
        private readonly PostgresContext _postgresContext;

        public ManagerRepository(PostgresContext postgresContext)
        {
            _postgresContext = postgresContext;
        }


        public async Task<bool> IsUserAlreadyExits(Manager manager)
        {
            return await _postgresContext.Manager
                .AnyAsync(t => t.ManagerName.Equals(manager.ManagerName));
        }

        public async Task<ActionResult> PostManager(Manager manager)
        {
            manager.ManagerId = Guid.NewGuid();

            await _postgresContext.Manager.AddAsync(manager);
            await _postgresContext.SaveChangesAsync();

            return new OkResult();


        }
    }
}
