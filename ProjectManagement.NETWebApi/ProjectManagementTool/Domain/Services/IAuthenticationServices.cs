using ProjectManagementTool.Domain.Models;

namespace ProjectManagementTool.Domain.Services
{
    public interface IAuthenticationServices
    {
        JwtToken Authenticate(string username, string password);
    }
}
