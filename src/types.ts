import { type } from "arktype";
import { useWfgForm, useWfgPrintForm } from "./hooks/useWfgForm";

const DataSet = type("Record<string, Record<string, string | number | boolean | null | undefined>[]>");
const DataRow = type("Record<string, string | number | boolean | null | undefined>");
export type DataRow = typeof DataRow.infer;
const Table1 = DataRow.merge({
    FORM_APPROVAL_ROLE: "string?",
    FORM_ACTION: "string?",
    FORM_VALIDATORS: "string.json?",
    FORM_FIELDS_REQUIRED: "string?",
    FORM_FIELDS_READONLY: "string?",
    FORM_FIELDS_HIDDEN: "string?",
    FORM_FIELDS_COMMANDS: "string?",
    FORM_FIELDS_COMMANDS_FAR: "string?",
    FORM_FIELDS_COMMANDS_MORE: "string?",
});
const Configuration = DataRow.merge({
    WF_ACTIVITY_DESC: "string",
    WF_ACTIVITY_ID: "number.integer",
    WF_ACTIVITY_INST_ID: "number.integer",
    WF_ACTIVITY_NAME: "string",
    WF_PROCESS_ID: "number.integer",
    WF_PROCESS_INST_ID: "number.integer",
    WF_PROCESS_NAME: "string",
    WF_PROCESS_VERSION: "number.integer",
    WF_ABS_URL: "string.url",
    WF_MODIFIED: "string.date.iso",
    WF_SERVER_VERSION: "string.semver",
    WF_CLIENT_VERSION: "string.semver",
});
export type Configuration = typeof Configuration.infer;
const Comment = DataRow.merge({
    Type: "'COMMENT' | 'REJECTION' | 'APPROVAL'",
    Role: "string?",
    Author: "string",
    UserName: "string",
    Directory: "string",
    Created: "string.date.iso",
    ProcessInstId: "number.integer",
    ProcessName: "string",
    ActivityInstId: "number.integer",
    ActivityName: "string",
    Comment: "string",
});
export type Comment = typeof Comment.infer;
const Approval = DataRow.merge({
    Role: "string",
    Approval: "'APPROVED' | 'REJECTED' | 'PENDING' | 'DISABLED'",
    ProcessInstId: "null | number.integer?",
    ActivityInstId: "null | number.integer?",
    ApproverUserName: "null | string?",
    ApproverEmployeeNumber: "null | string?",
    ApproverName: "null | string?",
    ApproverEmail: "null | string.email?",
    ApproverDirectory: "null | string?",
    ApprovedByUserName: "null | string?",
    ApprovedByEmployeeNumber: "null | string?",
    ApprovedByName: "null | string?",
    ApprovedByEmail: "null | string.email?",
    ApprovedByDirectory: "null | string?",
    Approved: "null | string.date.iso?",
});
export type Approval = typeof Approval.infer;
const User = DataRow.merge({
    Id: "number.integer",
    UserName: "string",
    EmployeeNumber: "string",
    CommonName: "string",
    FirstName: "string",
    LastName: "string",
    Email: "string.email",
    JobTitle: "string",
    Directory: "string",
    Locale: "0 < string < 6",
    TimeZoneId: "number.integer",
    IsActive: "boolean",
});
export type User = typeof User.infer;

export const TimeZoneInfo = type({
    Name: "string",
    UTCOffset: "number.integer",
});
export type TimeZoneInfo = typeof TimeZoneInfo.infer;

export const WfgDataSet = DataSet.merge({
    Table1: Table1.array().exactlyLength(1),
    __Configuration: Configuration.array().exactlyLength(1),
    __Assignee: User.array().exactlyLength(1),
    __CurrentUser: User.array().exactlyLength(1),
    __Comments: Comment.array(),
    __Approvals: Approval.array().optional()
});
export type WfgDataSet = typeof WfgDataSet.infer;

export const WfgInitData = type({
    Locale: "string",
    TimeZoneInfo: TimeZoneInfo,
    WfgDataSet: WfgDataSet,
});

export const WfgFormData = DataSet.merge({
    Table1: Table1.array().exactlyLength(1),
    __Comments: Comment.array(),
    __Approvals: Approval.array().optional(),
});
export type WfgFormData = typeof WfgFormData.infer;

export type WfgForm = ReturnType<typeof useWfgForm>;
export type WfgPrintForm = ReturnType<typeof useWfgPrintForm>;
export type WfgFormContext = {
    form: WfgForm;
    printForm: WfgPrintForm;
};

export const QueryResult = type({
    Rows: DataRow.array(),
    Total: "number.integer >= 0",
    HasNextPage: "boolean",
});
export type QueryResult = typeof QueryResult.infer;

export type ActionResult = {
    error?: string
    replyTo: string
};