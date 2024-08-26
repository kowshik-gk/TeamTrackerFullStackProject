namespace ProjectManagementTool.Domain.Models
{
    public class JwtToken
    {
        public string? Token { get; set; }
        public DateTime? Expiration { get; set; }
        public string? Role { get; set; }

        public Guid ? UserId { get; set; }
        public string? UserName { get; set; }

        public string? UserPassword { get; set; }
    }
}
