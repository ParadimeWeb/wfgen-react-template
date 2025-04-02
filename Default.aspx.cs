using System;
using FluentUITemplate.Models;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Threading;
using WorkflowGen.My.Data;
using ParadimeWeb.WorkflowGen.Web.UI.WebForms;


namespace FluentUITemplate
{
    public partial class Default : WorkflowPage
    {
        private FormData formData = new FormData();
        protected override System.Data.DataSet FormData => formData;

        protected override string[] OnFormDataInit()
        {
            formData.CreateUserTable("AssignedTo");
            AddApproval("approver");

            return new string[] { formData.SomeOtherTable.TableName };
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected override void OnPreSubmit(string action)
        {
            if (CurrentWorkflowActionName == "INITIATE_REQUEST")
            {
                // Do something before submit like approve.
                //Approve("approver", action == Command.Approve ? ApprovalType.Approved : ApprovalType.Rejected);
            }
            
        }

        protected override void OnAsyncActions(Dictionary<string, Action<string, string, ContextParameters>> actions)
        {
            actions.Add("myaction", (action, data, ctx) =>
            {
                Response.Write(JsonConvert.SerializeObject(new { 
                    Testing = "Testing"
                }));
            });
        }

        protected override void OnAsyncSave(string action, string data, ContextParameters ctx)
        {
            Thread.Sleep(5000);
            base.OnAsyncSave(action, data, ctx);
        }
    }
}