using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProjectManagementTool.Domain.Services;
using System;
using System.IdentityModel.Tokens.Jwt;
using ProjectManagementTool.Domain.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Context;

namespace ProjectManagementTool.Repository
{
    public class AuthenticationRepository : IAuthenticationServices
    {
        private readonly IConfiguration _configuration;
        private readonly PostgresContext _dbContext;

        public AuthenticationRepository(IConfiguration configuration, PostgresContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public JwtToken Authenticate(string username, string password)
        {
            bool isValid = ValidateUser(username, password);

            if (!isValid)
            {
                return new JwtToken
                {
                    Token = "NotFound",
                    UserName = username,
                };
            }

            string role = GetRole(username, password);
            var userId = GetUserId(username, password); // Get user ID

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = Encoding.ASCII.GetBytes(_configuration["Authentication:JWTKey"]);


            var expiryTime = DateTime.Now.AddHours(1);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role),
            new Claim("UserId", userId.ToString()) // Add user ID as a claim
        }),
                Expires = expiryTime,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(jwtKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string generatedToken = tokenHandler.WriteToken(token);

            StoreTokenInDatabaseAsync(username, userId, role, generatedToken, expiryTime).Wait();

            return new JwtToken
            {
                Token = generatedToken,
                Expiration = expiryTime,
                Role = role,
                UserId = userId,
                UserName = username
            };
        }

        private Guid GetUserId(string username, string password)
        {
            var manager = _dbContext.Manager.FirstOrDefault(manag => manag.ManagerName.Equals(username) && manag.ManagerPassword.Equals(password));
            var teamLeader = _dbContext.TeamLeader.FirstOrDefault(teamlead => teamlead.TeamLeaderName.Equals(username) && teamlead.TeamLeaderPassword.Equals(password));
            var employee = _dbContext.Employee.FirstOrDefault(emp => emp.EmployeeName.Equals(username) && emp.EmployeePassword.Equals(password));

            if (manager != null)
            {
                return manager.ManagerId;
            }
            else if (teamLeader != null)
            {
                return teamLeader.TeamLeaderId;
            }
            else if (employee != null)
            {
                return employee.EmployeeId;
            }

            throw new Exception("User not found");
        }


        private async Task StoreTokenInDatabaseAsync(string userName, Guid userId, string Role, string token, DateTime expiryDate)
        {
            // Convert the expiryDate to UTC if it is not already
            var utcExpiryDate = expiryDate.Kind == DateTimeKind.Local
                ? TimeZoneInfo.ConvertTimeToUtc(expiryDate)
                : expiryDate;

            //var userToken = new UserToken
            //{
            //    Username = userName,
            //    Token = token,
            //    ExpiryDate = utcExpiryDate // Store in UTC
            //};

            // _dbContext.UserTokens.Add(userToken);



            if (Role.Equals("manager"))
            {
                var UserCrendentails = await _dbContext.Manager.FirstOrDefaultAsync(manag => manag.ManagerName.Equals(userName) && manag.ManagerId.Equals(userId));
                UserCrendentails.JwtUserToken = token;
                UserCrendentails.Expiration = utcExpiryDate;

                _dbContext.Update(UserCrendentails);
            }
            else if (Role.Equals("teamleader"))
            {
                var UserCrendentails = await _dbContext.TeamLeader.FirstOrDefaultAsync(tl => tl.TeamLeaderName.Equals(userName) && tl.TeamLeaderId.Equals(userId));
                UserCrendentails.JwtUserToken = token;
                UserCrendentails.Expiration = utcExpiryDate;

                _dbContext.Update(UserCrendentails);

            }
            else
            {
                var UserCrendentails = await _dbContext.Employee.FirstOrDefaultAsync(tl => tl.EmployeeName.Equals(userName) && tl.EmployeeId.Equals(userId));
                UserCrendentails.JwtUserToken = token;
                UserCrendentails.Expiration = utcExpiryDate;

                _dbContext.Update(UserCrendentails);
            }

            await _dbContext.SaveChangesAsync();
        }





        private bool ValidateUser(string username, string password)
        {
            bool isManager = _dbContext.Manager.Any(manag => manag.ManagerName.Equals(username) && manag.ManagerPassword.Equals(password));
            bool isTeamLeader = _dbContext.TeamLeader.Any(teamlead => teamlead.TeamLeaderName.Equals(username) && teamlead.TeamLeaderPassword.Equals(password));

            bool isEmployee = _dbContext.Employee.Any(manag => manag.EmployeeName.Equals(username) && manag.EmployeePassword.Equals(password));

            return isManager || isTeamLeader || isEmployee;
        }


        private string GetRole(string username, string password)
        {
            var manager = _dbContext.Manager.FirstOrDefault(manag => manag.ManagerName.Equals(username) && manag.ManagerPassword.Equals(password));
            var teamLeader = _dbContext.TeamLeader.FirstOrDefault(teamlead => teamlead.TeamLeaderName.Equals(username) && teamlead.TeamLeaderPassword.Equals(password));

            if (manager != null)
            {
                return "manager";
            }
            else if (teamLeader != null)
            {
                return "teamleader";
            }
            else
            {
                return "employee";
            }
        }



    }
}
