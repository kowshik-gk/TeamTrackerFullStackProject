using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Domain.Model
{
    public class Project
    {
        [Key]
        public Guid ProjectId {  get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public int? NumberOfTasks {  get; set; }

        public int? CompletedTasks { get; set; }

        public DateTime? DueDate { get;set; }

        [ForeignKey("TeamLeader")]
        public Guid? AssigningTeamLeaderId { get; set; }

        [ForeignKey("Manager")]
        public Guid? CreatedManager {  get; set; }



    }
}
