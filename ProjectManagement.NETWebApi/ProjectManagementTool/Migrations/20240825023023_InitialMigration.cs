using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectManagementTool.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeName = table.Column<string>(type: "text", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    EmployeePassword = table.Column<string>(type: "text", nullable: false),
                    JwtUserToken = table.Column<string>(type: "text", nullable: true),
                    Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "Manager",
                columns: table => new
                {
                    ManagerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ManagerName = table.Column<string>(type: "text", nullable: true),
                    ManagerPassword = table.Column<string>(type: "text", nullable: false),
                    JwtUserToken = table.Column<string>(type: "text", nullable: true),
                    Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Manager", x => x.ManagerId);
                });

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    NumberOfTasks = table.Column<int>(type: "integer", nullable: true),
                    CompletedTasks = table.Column<int>(type: "integer", nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AssigningTeamLeaderId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedManager = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.ProjectId);
                });

            migrationBuilder.CreateTable(
                name: "Task",
                columns: table => new
                {
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskName = table.Column<string>(type: "text", nullable: true),
                    TaskStatus = table.Column<int>(type: "integer", nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    AssigningEmployeeId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedTeamLeader = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Task", x => x.TaskId);
                });

            migrationBuilder.CreateTable(
                name: "TeamLeader",
                columns: table => new
                {
                    TeamLeaderId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamLeaderName = table.Column<string>(type: "text", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    TeamLeaderPassword = table.Column<string>(type: "text", nullable: false),
                    JwtUserToken = table.Column<string>(type: "text", nullable: true),
                    Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamLeader", x => x.TeamLeaderId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_EmployeeName",
                table: "Employee",
                column: "EmployeeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Manager_ManagerName",
                table: "Manager",
                column: "ManagerName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Project_Name",
                table: "Project",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Task_TaskName",
                table: "Task",
                column: "TaskName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamLeader_TeamLeaderName",
                table: "TeamLeader",
                column: "TeamLeaderName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Manager");

            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropTable(
                name: "Task");

            migrationBuilder.DropTable(
                name: "TeamLeader");
        }
    }
}
