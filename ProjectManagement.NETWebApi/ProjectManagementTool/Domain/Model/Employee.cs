using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementTool.Domain.Model
{
    public class Employee
    {
        [Key]
        public Guid EmployeeId { get; set; }

        public required string EmployeeName { get; set; }

        [ForeignKey("Tasks")]
        public Guid? TaskId { get; set; }

        public required string EmployeePassword { get; set; }

        public string? JwtUserToken { get; set; }
        public DateTime? Expiration { get; set; }
    }
}
