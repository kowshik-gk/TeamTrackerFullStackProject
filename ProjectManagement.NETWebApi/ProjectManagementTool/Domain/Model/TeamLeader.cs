using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Domain.Model
{
    public class TeamLeader
    {
        [Key]
        public Guid TeamLeaderId { get; set; }
        public string? TeamLeaderName { get; set; }

        [ForeignKey("Project")]
        public Guid? ProjectId { get; set; }
        public required string TeamLeaderPassword { get; set; }
        public string? JwtUserToken { get; set; }
        public DateTime? Expiration { get; set; }
    }
}
