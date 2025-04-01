import { Chat, ChatMessage } from "@fluentui-contrib/react-chat";
import type { Approval, Comment } from "../../types";
import { Avatar, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { directoryColors } from "../../utils";
import dayjs from "dayjs";
import { CommentRegular, ShieldDismissRegular, ShieldRegular, ShieldTaskRegular } from "@fluentui/react-icons";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../Form/Provider";

const useStyles = makeStyles({
    chatMessage: {
        whiteSpace: 'pre-wrap'
    },
    chatPendingMessage: {
        borderLeftColor: tokens.colorNeutralForeground4
    },
    chatPendingDecorationIcon: {
        backgroundColor: tokens.colorNeutralForeground2
    },
    chatPendingDecorationLabel: {
        color: tokens.colorNeutralForeground3
    },
    chatRejectionMessage: {
        borderLeftColor: tokens.colorPaletteRedBorder1
    },
    chatRejectionDecorationIcon: {
        backgroundColor: tokens.colorPaletteRedBackground3
    },
    chatRejectionDecorationLabel: {
        color: tokens.colorPaletteRedForeground1
    },
    chatApprovalMessage: {
        borderLeftColor: tokens.colorPaletteGreenBorder1
    },
    chatApprovalDecorationIcon: {
        backgroundColor: tokens.colorPaletteGreenBackground3
    },
    chatApprovalDecorationLabel: {
        color: tokens.colorPaletteGreenForeground1
    },
    otherChatMessage: {
        paddingTop: '2px',
        paddingBottom: '2px'
    }
});

function OtherComments({ comments, approval }: { comments: Comment[], approval: Approval }) {
    const styles = useStyles();
    const { timeZoneInfo } = useFormInitQuery();
    const userName = approval.ApprovedByUserName ?? approval.ApproverUserName ?? '';

    return (
        <Chat>
            {comments.map((c, i) => {
                if (c.Type === 'REJECTION') {
                    return (
                        <ChatMessage 
                            key={`chatMessage-${i}`}
                            root={{ className: styles.otherChatMessage }}
                            body={{ className: mergeClasses(styles.chatMessage, styles.chatRejectionMessage) }}
                            author={userName !== c.UserName ? c.Author : null}
                            decorationLabel={{ className: styles.chatRejectionDecorationLabel }}
                            decorationIcon={{ className: styles.chatRejectionDecorationIcon, children: <CommentRegular /> }}
                            timestamp={dayjs(c.Created).utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
                        >
                            {c.Comment}
                        </ChatMessage>
                    );
                }
                return (
                    <ChatMessage
                        key={`chatMessage-${i}`}
                        root={{ className: styles.otherChatMessage }}
                        body={{ className: mergeClasses(styles.chatMessage, styles.chatApprovalMessage) }}
                        author={userName !== c.UserName ? c.Author : null}
                        decorationLabel={{ className: styles.chatApprovalDecorationLabel }}
                        decorationIcon={{ className: styles.chatApprovalDecorationIcon, children: <CommentRegular /> }}
                        timestamp={dayjs(c.Created).utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
                    >
                        {c.Comment}
                    </ChatMessage>
                );
            })}
        </Chat>
    );
}

export const ApprovalChatMessage = ({ approval }: { approval: Approval }) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { timeZoneInfo } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const name = approval.ApprovedByName ?? approval.ApproverName ?? t('Unassigned');
    const directory = approval.ApprovedByDirectory ?? approval.ApproverDirectory ?? '';

    return (
        <form.Subscribe 
            selector={s => s.values.__Comments.filter(c => c.Role === approval.Role)}
            children={comments => {
                const approvalComment = comments.find(c => c.ActivityInstId === approval.ActivityInstId);
                const otherComments = comments.filter(c => c.ActivityInstId !== approval.ActivityInstId);
                if (approval.Approval === 'APPROVED') {
                    return (<>
                        <ChatMessage
                            body={{ className: mergeClasses(styles.chatMessage, styles.chatApprovalMessage) }}
                            avatar={<Avatar name={name} color={directoryColors.get(directory)} />}
                            author={name}
                            decorationLabel={{ 
                                className: styles.chatApprovalDecorationLabel, 
                                children: approval.ApprovedByUserName === approval.ApproverUserName ? t('Approved') : t('Approved on behalf of {{ name }}', { name: approval.ApproverName }) 
                            }}
                            decorationIcon={{ className: styles.chatApprovalDecorationIcon, children: <ShieldTaskRegular /> }}
                            timestamp={dayjs(approval.Approved).utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
                        >
                            {approvalComment ? approvalComment.Comment : ''}
                        </ChatMessage>
                        {otherComments.length > 0 ? <OtherComments comments={otherComments} approval={approval} /> : null}
                    </>);
                }
                if (approval.Approval === 'REJECTED') {
                    return (<>
                        <ChatMessage
                            body={{ className: mergeClasses(styles.chatMessage, styles.chatRejectionMessage) }}
                            avatar={<Avatar name={name} color={directoryColors.get(directory)} />}
                            author={name}
                            decorationLabel={{ 
                                className: styles.chatRejectionDecorationLabel, 
                                children: approval.ApprovedByUserName === approval.ApproverUserName ? t('Rejected') : t('Rejected on behalf of {{ name }}', { name: approval.ApproverName }) 
                            }}
                            decorationIcon={{ className: styles.chatRejectionDecorationIcon, children: <ShieldDismissRegular /> }}
                            timestamp={dayjs(approval.Approved).utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
                        >
                            {approvalComment ? approvalComment.Comment : ''}
                        </ChatMessage>
                        {otherComments.length > 0 ? <OtherComments comments={otherComments} approval={approval} /> : null}
                    </>);
                }
                return (<>
                    <ChatMessage
                        body={{ className: mergeClasses(styles.chatMessage, styles.chatPendingMessage) }}
                        avatar={<Avatar name={name} color={directoryColors.get(directory)} />}
                        author={name}
                        decorationLabel={{
                            className: styles.chatPendingDecorationLabel, 
                            children: t('Pending')
                        }}
                        decorationIcon={{ className: styles.chatPendingDecorationIcon, children: <ShieldRegular /> }}
                    />
                    {comments.length > 0 ? <OtherComments comments={comments} approval={approval} /> : null}
                </>);
            }}
        />
    );
};