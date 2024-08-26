using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Responses
{
    public class ProjectRes
    {
    
        public Guid ProjectId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public int? NumberOfTasks { get; set; }

        public int? CompletedTasks { get; set; }

        public DateTime? DueDate { get; set; }
      
        public string? AssignedTeamLeader{ get; set; }

        public string? CreatedManager { get; set; }

        public ProjectRes(Guid projectId,string? name, string? description, int? numberOfTasks, int? completedTasks, DateTime? dueDate, string? assignedTeamLeader, string? createdManager)
        {
            ProjectId = projectId;
            Name = name;
            Description = description;
            NumberOfTasks = numberOfTasks;
            CompletedTasks = completedTasks;
            DueDate = dueDate;
            AssignedTeamLeader = assignedTeamLeader;
            CreatedManager = createdManager;
        }
    }
}
