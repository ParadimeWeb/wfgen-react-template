import { type } from "arktype";
import type { WfgForm, WfgPrintForm } from "./hooks/useWfgForm";

const Directory = type("'WORKFLOWGEN' | 'CENTRIC_BRANDS' | 'CUSTOMERS'");
export type Directory = typeof Directory.infer;
const DataSet = type("Record<string, Record<string, string | number | boolean | null | undefined>[]>");
const DataRow = type("Record<string, string | number | boolean | null | undefined>");
export type DataRow = typeof DataRow.infer;
const Table1 = DataRow.merge({
    FORM_APPROVAL_ROLE: "null | string?",
    FORM_ARCHIVE: "null | string",
    FORM_ACTION: "null | string",
    FORM_FIELDS_REQUIRED: "null | string",
    FORM_FIELDS_READONLY: "null | string",
    FORM_FIELDS_COMMANDS: "null | string",
    FORM_FIELDS_COMMANDS_FAR: "null | string",
    FORM_FIELDS_COMMANDS_MORE: "null | string",
});
export type Table1 = typeof Table1.infer;
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
    WF_MODIFIED: "null | string.date.iso",
    WF_SERVER_VERSION: "string.semver",
    WF_CLIENT_VERSION: "string.semver",
});
export type Configuration = typeof Configuration.infer;
const Comment = DataRow.merge({
    Type: "'COMMENT' | 'REJECTION' | 'APPROVAL'",
    Role: "null | string?",
    Author: "string",
    UserName: "string",
    Directory,
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
    Approval: "null | 'APPROVED' | 'REJECTED' | 'PENDING' | 'DISABLED'",
    ProcessInstId: "null | number.integer?",
    ActivityInstId: "null | number.integer?",
    ApproverUserName: "null | string?",
    ApproverEmployeeNumber: "null | string?",
    ApproverName: "null | string?",
    ApproverEmail: "null | string.email?",
    ApproverDirectory: Directory.or("null").optional(),
    ApprovedByUserName: "null | string?",
    ApprovedByEmployeeNumber: "null | string?",
    ApprovedByName: "null | string?",
    ApprovedByEmail: "null | string.email?",
    ApprovedByDirectory: Directory.or("null").optional(),
    Approved: "null | string.date.iso?",
});
export type Approval = typeof Approval.infer;
const User = DataRow.merge({
    Id: "null | number.integer",
    UserName: "null | string",
    EmployeeNumber: "null | string",
    CommonName: "null | string",
    FirstName: "null | string",
    LastName: "null | string",
    Email: "null | string.email",
    JobTitle: "null | string",
    Directory: Directory.or("null"),
    Locale: "null | 0 < string < 6",
    TimeZoneId: "null | number.integer",
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