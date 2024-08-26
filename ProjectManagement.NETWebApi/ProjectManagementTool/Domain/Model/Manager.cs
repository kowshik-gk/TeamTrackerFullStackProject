using System.ComponentModel.DataAnnotations;

namespace ProjectManagementTool.Domain.Model
{
    public class Manager
    {
        [Key]
        public Guid ManagerId { get; set; }
        public string? ManagerName { get; set; }
        public required string ManagerPassword { get; set; }
        public string? JwtUserToken { get; set; }
        public DateTime? Expiration { get; set; }
    }
}
