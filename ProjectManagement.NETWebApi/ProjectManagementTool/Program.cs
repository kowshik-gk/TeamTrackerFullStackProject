using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using ProjectManagementTool.Context;
using ProjectManagementTool.Domain.Services;
using ProjectManagementTool.Repository;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Project Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
builder.Services.AddDbContext<PostgresContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

builder.Services.AddDbContext<MySqlDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MySqlConnection")));

builder.Services.AddScoped<IProjectService, ProjectRepository>();
builder.Services.AddScoped<ITaskService, TaskRepository>();
builder.Services.AddScoped<IAuthenticationServices,AuthenticationRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeRepository>();
builder.Services.AddScoped<ITeamLeaderService, TeamLeaderRepository>();
builder.Services.AddScoped<IManagerServices, ManagerRepository>();



var jwtKey = builder.Configuration["Authentication:JWTKey"];
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,  // Set to true if you have an issuer to validate
        ValidateAudience = false, // Set to true if you have an audience to validate
        ValidateLifetime = true, // Ensure token lifetime validation
        ClockSkew = TimeSpan.Zero // Optionally adjust for clock skew if necessary
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("manager", policy => policy.RequireRole("manager"));
    options.AddPolicy("teamleader", policy => policy.RequireRole("teamleader"));
    options.AddPolicy("employee", policy => policy.RequireRole("employee"));
});


builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();



