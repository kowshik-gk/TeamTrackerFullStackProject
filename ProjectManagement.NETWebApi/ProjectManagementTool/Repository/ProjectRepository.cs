using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.Model;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Responses;

namespace ProjectManagementTool.Repository
{
    public class ProjectRepository : IProjectService
    {
        private readonly PostgresContext _postgresContext;

        public ProjectRepository(PostgresContext postgresContext)
        {
            _postgresContext = postgresContext;
        }

        public async Task<ActionResult> AddProjectByManager(Project proj)
        {
            var TLAlocated = await _postgresContext.TeamLeader.FindAsync(proj.AssigningTeamLeaderId);

            if (!(TLAlocated.ProjectId).Equals('0') && (TLAlocated.ProjectId) != null)
            {
                return new BadRequestObjectResult("TL is Handling Another project");
            }

            if (proj.CompletedTasks == proj.NumberOfTasks)
            {
                return new BadRequestObjectResult("Enter Task Details correctly");
            }

            if (proj.DueDate.HasValue)
            {
                var utcDueDate = TimeZoneInfo.ConvertTimeToUtc(proj.DueDate.Value);
                proj.DueDate = utcDueDate;
            }


            try
            {
                await _postgresContext.Project.AddAsync(proj);
                await _postgresContext.SaveChangesAsync();
            }
            catch (Exception ex) { Console.WriteLine(ex); }

            var newProjectId = proj.ProjectId;

            var TL = await _postgresContext.TeamLeader.FindAsync(proj.AssigningTeamLeaderId);
            if (TL != null)
            {
                TL.ProjectId = newProjectId;
                _postgresContext.TeamLeader.Update(TL);
                await _postgresContext.SaveChangesAsync();
            }

            return new OkResult();
        }

        public async Task<ActionResult> ReportProjectCompletionByTeamLeader(Guid teamLeaderId, Guid projectId)
        {
            var tl = await _postgresContext.TeamLeader.FindAsync(teamLeaderId);

            var TLWorkingProjectId = tl.ProjectId;

            var proj = _postgresContext.Project
                .FirstOrDefault(p => p.AssigningTeamLeaderId.Equals(teamLeaderId) && p.ProjectId == TLWorkingProjectId);



            if (proj.ProjectId != projectId)
            {
                return new BadRequestObjectResult("--You are not working on this Project, Enter Valid Project ID--");
            }

            if (proj == null || proj.NumberOfTasks > proj.CompletedTasks)
            {
                return new BadRequestObjectResult("Pending Tasks are there or Project not found.");
            }
            if (tl != null)
            {
                tl.ProjectId = null;
                _postgresContext.TeamLeader.Update(tl);
                await _postgresContext.SaveChangesAsync();
            }

            if (proj.DueDate.HasValue)
            {
                var utcDueDate = TimeZoneInfo.ConvertTimeToUtc(proj.DueDate.Value);
                proj.DueDate = utcDueDate;
            }

            _postgresContext.Project.Update(proj);
            await _postgresContext.SaveChangesAsync();

            return new OkObjectResult("Project completed successfully.");
        }


        public async Task<List<ProjectRes>> GetCompletedProjects()
        {
            var projects = await _postgresContext.Project
                .Where(projs => projs.CompletedTasks == projs.NumberOfTasks)
                .ToListAsync();

            var responseList = new List<ProjectRes>();

            foreach (var proj in projects)
            {
                var teamLeaderName = await _postgresContext.TeamLeader
                      .Where(tl => tl.TeamLeaderId.Equals(proj.AssigningTeamLeaderId))
                      .Select(tl => tl.TeamLeaderName)
                      .SingleOrDefaultAsync() ?? "Not Found";

                var managerName = await _postgresContext.Manager
                .Where(m => m.ManagerId == proj.CreatedManager)
                .Select(m => m.ManagerName)
                .SingleOrDefaultAsync();

                var responseProj = new ProjectRes(
                    proj.ProjectId,
                    proj.Name,
                    proj.Description,
                    proj.NumberOfTasks,
                    proj.CompletedTasks,
                    proj.DueDate,
                    teamLeaderName,
                    managerName
                );

                responseList.Add(responseProj);
            }

            return responseList;
        }

        public async Task<List<ProjectRes>> GetIncompletedProjects()
        {
            var projects = await _postgresContext.Project
                .Where(projs => projs.CompletedTasks < projs.NumberOfTasks).ToListAsync();
                

            var responseList = new List<ProjectRes>();

            foreach (var proj in projects)
            {
                var teamLeaderName = await _postgresContext.TeamLeader
                    .Where(tl => tl.TeamLeaderId.Equals(proj.AssigningTeamLeaderId))
                    .Select(tl => tl.TeamLeaderName)
                    .SingleOrDefaultAsync() ?? "Not Found";

                var managerName = await _postgresContext.Manager
                .Where(m => m.ManagerId == proj.CreatedManager)
                .Select(m => m.ManagerName)
                .SingleOrDefaultAsync();

                var responseProj = new ProjectRes(
                    proj.ProjectId,
                    proj.Name,
                    proj.Description,
                    proj.NumberOfTasks,
                    proj.CompletedTasks,
                    proj.DueDate,
                    teamLeaderName,
                    managerName
                );

                responseList.Add(responseProj);
            }

            return responseList;
        }

        public async Task<List<ProjectRes>> GetProjectsAssignedBYByManager(string managerId)
        {
            var projects = await _postgresContext.Project
                .Where(p => p.CreatedManager.Equals(new Guid(managerId)))
                .ToListAsync();

            var responseList = new List<ProjectRes>();

            foreach (var proj in projects)
            {
                var teamLeaderName = await _postgresContext.TeamLeader
                      .Where(tl => tl.TeamLeaderId.Equals(proj.AssigningTeamLeaderId))
                      .Select(tl => tl.TeamLeaderName)
                      .SingleOrDefaultAsync() ?? "Not Found";

                var managerName = await _postgresContext.Manager
                .Where(m => m.ManagerId == proj.CreatedManager)
                .Select(m => m.ManagerName)
                .SingleOrDefaultAsync();

                var responseProj = new ProjectRes(
                    proj.ProjectId,
                    proj.Name,
                    proj.Description,
                    proj.NumberOfTasks,
                    proj.CompletedTasks,
                    proj.DueDate,
                    teamLeaderName,
                    managerName
                );

                responseList.Add(responseProj);
            }

            return responseList;
        }


        public async Task<List<ProjectRes>> GetProjectsAssignedForTeamLead(string TLid, bool PostState, bool IsView)
        {
            var projModel = await _postgresContext.Project
                .Where(t => t.AssigningTeamLeaderId.Equals(new Guid(TLid)))
                .ToListAsync();

            var result = new List<ProjectRes>();

            foreach (var proj in projModel)
            {
                string managerName = "Not Found";


                //var teamLeaderName = await _postgresContext.TeamLeader
                //     .Where(tl => tl.TeamLeaderId.Equals(proj.AssigningTeamLeader)
                //     .Select(tl => tl.TeamLeaderName)
                //     .SingleOrDefaultAsync() ?? "Not Found");

                managerName = await _postgresContext.Manager
                .Where(m => m.ManagerId == proj.CreatedManager)
                .Select(m => m.ManagerName)
                .SingleOrDefaultAsync();

                if (proj.CompletedTasks == proj.NumberOfTasks && !PostState && !IsView)
                {
                    result.Add(new ProjectRes(proj.ProjectId, proj.Name, proj.Description, proj.NumberOfTasks, proj.CompletedTasks, proj.DueDate, "notfound1", managerName));
                }
                else if (proj.CompletedTasks < proj.NumberOfTasks && PostState && !IsView)
                {
                    result.Add(new ProjectRes(proj.ProjectId, proj.Name, proj.Description, proj.NumberOfTasks, proj.CompletedTasks, proj.DueDate, "notfound2", managerName));
                }
                else if (proj.CompletedTasks <= proj.NumberOfTasks && !PostState && IsView)
                {
                    result.Add(new ProjectRes(proj.ProjectId, proj.Name, proj.Description, proj.NumberOfTasks, proj.CompletedTasks, proj.DueDate, "notfound", managerName));
                }
            }

            return result;
        }
    }
}

