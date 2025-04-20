export const initData = {
    "Locale":"en-US",
    "TimeZoneInfo": {
        "Name":"(GMT-08:00) Pacific Time (US and Canada)",
        "UTCOffset":-480
    },
    "WfgDataSet": {
        "Table1": [{
            "Status": "",
            "ProductNumbers": null,
            "LastName":"",
            "StartDate":null,
            "FirstName":"Gabriel",
            "EndDate":"2023-07-14T00:00:00Z",
            "Document":"Key=Document",
            "File2":"Key=File2&Path=file%5CFile2%5CRE_+D%26B+APPROVAL+SANGSHIN+ELECOM+RE_+%5BEXTERNAL%5D+FW_+RFMW+Quote+913581%2C+CMC+Electronics%2C+Inc+Reference_+%5BSensitive+Information%5D.pdf&Name=RE_+D%26B+APPROVAL+SANGSHIN+ELECOM+RE_+%5BEXTERNAL%5D+FW_+RFMW+Quote+913581%2C+CMC+Electronics%2C+Inc+Reference_+%5BSensitive+Information%5D.pdf",
            "File1":"Key=File1&Path=file%5CSome+Cool+File.pdf&Name=Some+Cool+File.pdf",
            "Attachments": "Key=Zip0&Path=file%5CZipFile%5CSome+Cool+File.pdf&Name=Some+Cool+File.pdf&Key=Zip1&Path=file%5CZipFile%5CTesting.pdf&Name=Testing.pdf",
            "Attachments2": "Key=Attachments2",
            "Checkbox":"Y",
            "Toggle":"Y",
            "Fruits":"Orange",
            "Amount":null,
            "ChoiceGroup":null,
            "SpinButtonValue":null,
            "SpinButtonValue2":152,
            "Textarea": null,
            "FORM_APPROVAL_ROLE": "approver",
            "FORM_ARCHIVE":"form_archive.htm",
            "FORM_ACTION":"DRAFT",
            "FORM_FIELDS_COMMANDS":"SAVE,SAVEICON,SAVECLOSE,SAVECLOSEICON,SUBMIT,SUBMITICON,DIVIDER,APPROVEICON,REJECTICON",
            "FORM_FIELDS_COMMANDS_FAR":"APPROVALSICON,COMMENTSICON,PRINTICON,CLOSEICON,CANCELICON",
            "FORM_FIELDS_COMMANDS_MORE":"APPROVALS,COMMENTS,PRINT,CANCEL,CUSTOM,DIVIDER,CLOSE",
            "FORM_FIELDS_HIDDEN":"",
            "FORM_FIELDS_READONLY":"",
            "FORM_FIELDS_REQUIRED":"LastName,COMMENTS,APPROVE_COMMENTS,REJECT_COMMENTS,File3",
            "FORM_VALIDATORS": "{ \"Table1\": [{\"FirstName\": \"string >= 3 & string < 10\",\"LastName\": \"string > 0\",\"Amount\": \"number\"}]}"
        }],
        "Files": [
            {
                Field: "File1",
            },
            {
                Field: "File2"
            }
        ],
        "__Comments": [
            {
                "Type":"REJECTION",
                "Role":"approver",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-09-04T18:05:07.7118249Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":56,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"This is a rejection comment3"
            },
            {
                "Type":"REJECTION",
                "Role":"approver",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-09-03T18:05:07.7118249Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":50,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"This is a rejection comment2"
            },
            {
                "Type":"APPROVAL",
                "Role":"approver",
                "Author":"David Russell",
                "UserName":"CMCE\\DRussell",
                "Directory":"CENTRIC_BRANDS",
                "Created":"2022-09-02T18:05:07.7118249Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":44,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"This is an approval comment"
            },
            {
                "Type":"REJECTION",
                "Role":"approver",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-09-01T18:05:07.7118249Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":38,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"This is a rejection comment"
            },
            {
                "Type":"COMMENT",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-08-20T00:43:48.603Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":49,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"gfhdfghfgh"
            },
            {
                "Type":"REJECTION",
                "Role":"approver2",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-08-19T23:51:52.961Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":21,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"test"
            },
            {
                "Type":"APPROVAL",
                "Role":"approver2",
                "Author":"WorkflowGen Administrator",
                "UserName":"wfgen_admin",
                "Directory":"WORKFLOWGEN",
                "Created":"2022-08-19T23:51:52.961Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":11,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"test comment approval"
            },
            {
                "Type":"COMMENT",
                "Author":"Gabriel Beauchamp",
                "UserName":"gbeaucha",
                "Directory":"CENTRIC_BRANDS",
                "Created":"2022-08-19T23:51:52.961Z",
                "ProcessInstId": 109,
                "ProcessName": "PROCESS 123",
                "ActivityInstId":48,
                "ActivityName":"INITIATE_REQUEST",
                "Comment":"test comment"
            }
        ],
        "__Configuration": [{
            "WF_ACTIVITY_DESC":"Lancer la demande / Initiate Request",
            "WF_ACTIVITY_ID":1,
            "WF_ACTIVITY_INST_ID":57,
            "WF_ACTIVITY_NAME":"INITIATE_REQUEST",
            "WF_PROCESS_ID":47,
            "WF_PROCESS_INST_ID":20094,
            "WF_PROCESS_NAME":"TEST_FRAMEWORK",
            "WF_PROCESS_VERSION":1,
            "WF_ABS_URL":"https://eforms.dev.cmce.ca/wfapps/webforms/TEST_FRAMEWORK/V1/Default.aspx",
            "WF_MODIFIED":"2022-09-04T18:05:07.7128221Z",
            "WF_SERVER_VERSION":"4.0.4",
            "WF_CLIENT_VERSION":"4.0.100"
        }],
        "__CurrentUser": [{
            "Id":1,
            "UserName":"wfgen_admin",
            "EmployeeNumber":"00000",
            "CommonName":"WorkflowGen Administrator",
            "FirstName":"WorkflowGen",
            "LastName":"Administrator",
            "Email":"gabriel.beauchamp@gmail.com",
            "JobTitle":"WorkflowGen Administrator",
            "Locale":"fr-CA",
            "TimeZoneId": 9,
            "Directory":"WORKFLOWGEN",
            "IsActive":true
        }],
        "__Assignee": [{
            "Id":1,
            "UserName":"wfgen_admin",
            "EmployeeNumber":"00000",
            "CommonName":"WorkflowGen Administrator",
            "FirstName":"WorkflowGen",
            "LastName":"Administrator",
            "Email":"gabriel.beauchamp@gmail.com",
            "JobTitle":"WorkflowGen Administrator",
            "Locale":"fr-CA",
            "TimeZoneId": 9,
            "Directory":"WORKFLOWGEN",
            "IsActive":true}],
        "AssignedTo": [{
            "Id":null,
            "UserName":"cmce\\glord",
            "EmployeeNumber":"222514",
            "CommonName":"Lord, Germain",
            "FirstName":"Germain",
            "LastName":"Lord",
            "Email":"germain.lord@cmcelectronics.ca",
            "JobTitle":"IT Director",
            "Locale":"fr-CA",
            "TimeZoneId": 9,
            "Directory":"CUSTOMERS",
            "IsActive":true
        }],
        "AssignedTo2": [],
        "CostCenterItems": [
            {"Value":"741","Text":"741 IT Infrastructure"}
        ],
        "ProgramItems": [],
        "AddNewItems": [],
        "ProjectItems": [],
        "ElementItems": [],
        "ActivityItems": [],
        "SomeOtherTable": [
            {
                "Field1": "This is field 1",
                "Field2": "Field 2 is not null here"
            },
            {
                "Field1": "Another field 1",
                "Field2": null
            }
        ],
        "ComplexItem": [],
        "Currency": [
            { "code":"USD","name":"United States Dollar","rate":1.297690}
        ],
        "Country": [
            { "Code":"US","Country":"U.S.A."}
        ],
        "DropdownOption": [
            { Text: "Orange", Value: "Orange" },
            { Text: "Apple", Value: "Apple" }
        ],
        "__Approvals": [
            {
                "ActivityInstId":56,
                "Role":"approver",
                "ApproverUserName":"CMCE\\DRussell",
                "ApproverEmployeeNumber":"34302",
                "ApproverEmail":"David.Russell@CMCElectronics.ca",
                "ApproverName":"Russell, David",
                "ApproverDirectory":"CENTRIC_BRANDS",
                "ApprovedByUserName":"wfgen_admin",
                "ApprovedByEmployeeNumber":"00000",
                "ApprovedByEmail":"gabriel.beauchamp@gmail.com",
                "ApprovedByName":"WorkflowGen Administrator",
                "ApprovedByDirectory":"WORKFLOWGEN",
                "Approval":"REJECTED",
                "Approved":"2022-09-04T18:05:07.7118249Z"
            },
            {
                "ActivityInstId":21,
                "Role":"approver2",
                "ApproverUserName":"wfgen_admin",
                "ApproverEmployeeNumber":"00000",
                "ApproverEmail":"gabriel.beauchamp@gmail.com",
                "ApproverName":"WorkflowGen Administrator",
                "ApproverDirectory":"CENTRIC_BRANDS",
                "ApprovedByUserName":"wfgen_admin",
                "ApprovedByEmployeeNumber":"00000",
                "ApprovedByEmail":"gabriel.beauchamp@gmail.com",
                "ApprovedByName":"WorkflowGen Administrator",
                "ApprovedByDirectory":"WORKFLOWGEN",
                "Approval":"REJECTED",
                "Approved":"2022-07-29T04:39:22.0446478Z"
            },
            {
                "ActivityInstId":null,
                "Role":"approver3",
                "ApproverUserName":"CMCE\\GBeaucha",
                "ApproverEmployeeNumber":"52128",
                "ApproverEmail":"Gabriel.Beauchamp@CMCElectronics.ca",
                "ApproverName":"Beauchamp, Gabriel",
                "ApproverDirectory":"CENTRIC_BRANDS",
                "ApprovedByUserName":null,
                "ApprovedByEmployeeNumber":null,
                "ApprovedByEmail":null,
                "ApprovedByName":null,
                "Approval":"PENDING",
                "Approved":null
            }
        ]
    }
};

export const user1 = {
    "Id":1,
    "UserName":"wfgen_admin",
    "EmployeeNumber":"00000",
    "CommonName":"WorkflowGen Administrator",
    "FirstName":"WorkflowGen",
    "LastName":"Administrator",
    "Email":"gabriel.beauchamp@gmail.com",
    "JobTitle":"WorkflowGen Administrator",
    "Locale":"fr-CA",
    "TimeZoneId": 9,
    "Directory":"WORKFLOWGEN",
    "IsActive":true
};
export const user2 = {
    "Id":2,
    "UserName":"gbeaucha",
    "EmployeeNumber":"12345",
    "CommonName":"Gabriel Beauchamp",
    "FirstName":"Gabriel",
    "LastName":"Beauchamp",
    "Email":"gabriel.beauchamp@ACME.com",
    "JobTitle":"President",
    "Locale":"fr-CA",
    "TimeZoneId": 9,
    "Directory":"CENTRIC_BRANDS",
    "IsActive":true
};
export const generateUsers = (count) => {
    const users = [];
    for (let i = 1; i <= count; i++) {
        if (i === 1) {
            users.push({...user1});
            continue;
        }
        if (i === 2) {
            users.push({...user2});
            continue;
        }
        users.push({...user2, Id: i, UserName: `${user2.UserName}${i}`});
    }
    return users;
}
export const users = generateUsers(2000);