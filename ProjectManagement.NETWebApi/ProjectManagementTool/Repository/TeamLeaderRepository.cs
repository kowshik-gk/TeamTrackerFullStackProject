using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Responses;
using Microsoft.EntityFrameworkCore;

namespace ProjectManagementTool.Repository
{
    public class TeamLeaderRepository : ITeamLeaderService
    {
        private readonly PostgresContext _postgresDbContext;

        public TeamLeaderRepository(PostgresContext postgresContext)
        {
            _postgresDbContext = postgresContext;
        }
        public async Task<ActionResult> PostTL(TeamLeader TeamLead)
        {
            TeamLead.ProjectId = null;
            TeamLead.TeamLeaderId = Guid.NewGuid();
            await _postgresDbContext.TeamLeader.AddAsync(TeamLead);
            await _postgresDbContext.SaveChangesAsync();
            return new OkResult();
        }
        public async Task<bool> IsUserAlreadyExits(TeamLeader tl)
        {
            return await _postgresDbContext.TeamLeader
                .AnyAsync(t => t.TeamLeaderName.Equals(tl.TeamLeaderName));
        }
        public async Task<List<TLResp>> GetWorkingTL()
        {
            var teamleads = await _postgresDbContext.TeamLeader
                .Where(tl => !tl.ProjectId.Equals("0") || tl.ProjectId != null)
                .ToListAsync();

            var responseList = new List<TLResp>();

            foreach (var teamlead in teamleads)
            {
                var proj = await _postgresDbContext.Project
                .Where(proj => proj.ProjectId == teamlead.ProjectId)
                .SingleOrDefaultAsync();

                if (proj != null)
                {
                    var projName = proj.Name;
                    var managerId = proj.CreatedManager;

                    var managerName = await _postgresDbContext.Manager.Where(t => t.ManagerId.Equals(managerId)).Select(t => t.ManagerName).FirstOrDefaultAsync();

                    var responseTL = new TLResp(teamlead.TeamLeaderId, teamlead.TeamLeaderName, projName, managerName.ToString());

                    responseList.Add(responseTL);
                }
            }
            return responseList;
        }

        public async Task<List<TLResp>> GetNonWorkingTL()
        {
            var teamleads = await _postgresDbContext.TeamLeader
                .Where(tl => tl.ProjectId.Equals("0") || tl.ProjectId == null)
                .ToListAsync();

            var responseList = new List<TLResp>();

            foreach (var teamlead in teamleads)
            {
                var responseTL = new TLResp(teamlead.TeamLeaderId, teamlead.TeamLeaderName, "No Project Assigned", "No Project Assigned");

                responseList.Add(responseTL);

            }
            return responseList;
        }

        public async Task<TLResp> GetTeamLeaderByUserId(string teamLeaderUserName)
        {
            var teamLead = await _postgresDbContext.TeamLeader.Where(t => t.TeamLeaderId.Equals(teamLeaderUserName)).SingleOrDefaultAsync();
            var workingProject = await _postgresDbContext.Project.Where(t => t.ProjectId == teamLead.ProjectId).SingleOrDefaultAsync();

            var createdManager = await _postgresDbContext.TeamLeader.Where(t => t.TeamLeaderId == workingProject.CreatedManager).Select(t => t.TeamLeaderName).FirstOrDefaultAsync();

            if (teamLead == null)
            {
                return new TLResp();
            }

            if (workingProject == null)
            {
                return new TLResp(teamLead.TeamLeaderId, teamLead.TeamLeaderName, "not assigned any Proj", "not assigned any proj");
            }
            return new TLResp(teamLead.TeamLeaderId, teamLead.TeamLeaderName, workingProject.Name, createdManager);


        }
    }
}
