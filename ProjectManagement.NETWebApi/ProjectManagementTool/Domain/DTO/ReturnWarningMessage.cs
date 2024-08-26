namespace ProjectManagementTool.Domain.DTO
{
    public class ReturnWarningMessage
    {
        public string ResultData {  get; set; }

        public bool Warning {  get; set; }
        public ReturnWarningMessage(string resultData,bool warning) {
            ResultData = resultData;
            Warning = warning;
        
        }
    }
}
