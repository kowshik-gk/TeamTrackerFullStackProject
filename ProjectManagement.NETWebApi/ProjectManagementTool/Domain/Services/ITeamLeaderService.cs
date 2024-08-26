using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Domain.Services
{
    public interface ITeamLeaderService
    {

        Task<ActionResult> PostTL(TeamLeader teamLeader);
        Task<List<TLResp>> GetWorkingTL();
        Task<List<TLResp>> GetNonWorkingTL();
        Task<TLResp> GetTeamLeaderByUserId(string teamLeaderUserName);

        Task<bool> IsUserAlreadyExits(TeamLeader tl);
    }
}
