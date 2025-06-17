import { MenuDivider, ToolbarDivider } from "@fluentui/react-components";
import { ApprovalsButton, ApprovalsIconButton, ApprovalsMenuItem } from "@wfgen/components/Commands/Approvals";
import { Archive, ArchiveCopyLink, ArchiveDownload } from "@wfgen/components/Commands/Archive";
import { CancelButton, CancelIconButton, CancelMenuItem } from "@wfgen/components/Commands/Cancel";
import { CommentsButton, CommentsIconButton, CommentsMenuItem } from "@wfgen/components/Commands/Comments";
import { PrintViewButton, PrintViewIconButton, PrintViewMenuItem } from "@wfgen/components/Commands/PrintView";
import { SaveButton, SaveIconButton, SaveMenuItem } from "@wfgen/components/Commands/Save";
import { SaveCloseButton, SaveCloseIconButton, SaveCloseMenuItem } from "@wfgen/components/Commands/SaveClose";
import { SubmitButton, SubmitIconButton, SubmitMenuItem } from "@wfgen/components/Commands/Submit";
import { CloseButton, CloseIconButton, CloseMenuItem } from "@wfgen/components/Commands/Close";
import { ApproveButton, ApproveIconButton, ApproveMenuItem } from "@wfgen/components/Commands/Approve";
import { RejectButton, RejectIconButton, RejectMenuItem } from "@wfgen/components/Commands/Reject";

const commands = new Map<string, { 
    button: () => JSX.Element
    menuItem?: () => JSX.Element 
}>([
    ['APPROVALS', { button: () => <ApprovalsButton />, menuItem: () => <ApprovalsMenuItem /> }],
    ['APPROVALSICON', { button: () => <ApprovalsIconButton />, menuItem: () => <ApprovalsMenuItem /> }],
    ['APPROVE', { button: () => <ApproveButton />, menuItem: () => <ApproveMenuItem /> }],
    ['APPROVEICON', { button: () => <ApproveIconButton />, menuItem: () => <ApproveMenuItem /> }],
    ['ARCHIVE', { button: () => <Archive /> }],
    ['ARCHIVE_DOWNLOAD', { button: () => <ArchiveDownload /> }],
    ['ARCHIVE_COPY_LINK', { button: () => <ArchiveCopyLink /> }],
    ['CANCEL', { button: () => <CancelButton />, menuItem: () => <CancelMenuItem /> }],
    ['CANCELICON', { button: () => <CancelIconButton />, menuItem: () => <CancelMenuItem /> }],
    ['CLOSE', { button: () => <CloseButton />, menuItem: () => <CloseMenuItem /> }],
    ['CLOSEICON', { button: () => <CloseIconButton />, menuItem: () => <CloseMenuItem /> }],
    ['COMMENTS', { button: () => <CommentsButton />, menuItem: () => <CommentsMenuItem /> }],
    ['COMMENTSICON', { button: () => <CommentsIconButton />, menuItem: () => <CommentsMenuItem /> }],
    ['DIVIDER', { button: () => <ToolbarDivider />, menuItem: () => <MenuDivider /> }],
    ['PRINT', { button: () => <PrintViewButton />, menuItem: () => <PrintViewMenuItem /> }],
    ['PRINTICON', { button: () => <PrintViewIconButton />, menuItem: () => <PrintViewMenuItem /> }],
    ['REJECT', { button: () => <RejectButton />, menuItem: () => <RejectMenuItem /> }],
    ['REJECTICON', { button: () => <RejectIconButton />, menuItem: () => <RejectMenuItem /> }],
    ['SAVE', { button: () => <SaveButton />, menuItem: () => <SaveMenuItem /> }],
    ['SAVEICON', { button: () => <SaveIconButton />, menuItem: () => <SaveMenuItem /> }],
    ['SAVECLOSE', { button: () => <SaveCloseButton />, menuItem: () => <SaveCloseMenuItem /> }],
    ['SAVECLOSEICON', { button: () => <SaveCloseIconButton />, menuItem: () => <SaveCloseMenuItem /> }],
    ['SUBMIT', { button: () => <SubmitButton />, menuItem: () => <SubmitMenuItem /> }],
    ['SUBMITICON', { button: () => <SubmitIconButton />, menuItem: () => <SubmitMenuItem /> }],
]);

export default commands;