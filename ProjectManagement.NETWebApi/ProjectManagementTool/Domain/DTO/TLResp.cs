namespace ProjectManagementTool.Responses
{
    public class TLResp
    {
        public Guid TeamLeadId { get; private set; }
        public string TLName { get; set; }
        public string ProjectName { get; set; }
        public string AssignedManager { get; set; }

        public TLResp() { }
        public TLResp(Guid teamLeadId, string tLName, string projectName, string assignedManager)
        {
            TeamLeadId = teamLeadId;
            TLName = tLName;
            ProjectName = projectName;
            AssignedManager = assignedManager;
        }

    }
}
