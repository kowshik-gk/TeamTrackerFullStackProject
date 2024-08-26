using System;

namespace ProjectManagementTool.Domain.Models
{
    public class UserToken
    {
        public Guid UserId { get; set; }
        public string? Username { get; set; }
        public string? Token { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
