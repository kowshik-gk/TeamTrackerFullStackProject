using Microsoft.AspNetCore.Mvc;
using ProjectManagementTool.Domain.DTO;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Repository;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamLeaderController : Controller
    {

        private ITeamLeaderService _teamLeaderService;

        public TeamLeaderController(ITeamLeaderService teamLeaderService)
        {
            _teamLeaderService = teamLeaderService;
        }
        [HttpPost("SignUp-TL")]
        public async Task<ReturnWarningMessage> PostTeamLead(TeamLeader TeamLead)
        {
            if (await _teamLeaderService.IsUserAlreadyExits(TeamLead))
            {
                return new ReturnWarningMessage("UserName Exists. Try Another UserName.", false);
            }
            if (ModelState.IsValid)
            {
                 await _teamLeaderService.PostTL(TeamLead);
            }
            return new ReturnWarningMessage("SignUp Successfull ,Login to Continue", true);
        }

        [HttpGet("Working-TL")]
        public async Task<ActionResult<List<TeamLeader>>> GetWorkingTL()
        {
            var teamLeaders = await _teamLeaderService.GetWorkingTL();
            return Ok(teamLeaders);
        }

        [HttpGet("Non-Working-TL")]
        public async Task<ActionResult<List<TLResp>>> GetNonWorkingTL()
        {
            var teamLeaders = await _teamLeaderService.GetNonWorkingTL();
            return Ok(teamLeaders);
        }

        [HttpGet("GetTeamLeaderByUserName/{teamLeaderUserName}")]

        public async Task<ActionResult<TLResp>> GetTeamLeaderByUserId(string teamLeaderUserName)
        {
            var tasks = await _teamLeaderService.GetTeamLeaderByUserId(teamLeaderUserName);

            if (tasks == null)
            {
                return NotFound();
            }

            return NotFound();

        }
    }
}
