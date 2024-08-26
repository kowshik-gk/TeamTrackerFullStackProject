using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Domain.Model
{
    public class Tasks
    {
        [Key]
        public Guid TaskId { get; set; }

        public string? TaskName {  get; set; }

        public int? TaskStatus { get; set; }
        public DateTime? DueDate { get; set; }

        [ForeignKey("Project")]
        public Guid? ProjectId { get; set; }

        [ForeignKey("Employee")]
        public Guid? AssigningEmployeeId { get; set; }

        [ForeignKey("TeamLeader")]
        public Guid? CreatedTeamLeader { get; set; }
    }
}
