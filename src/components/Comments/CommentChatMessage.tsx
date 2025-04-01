import { ChatMessage } from "@fluentui-contrib/react-chat";
import type { Comment } from "../../types";
import { Avatar, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { directoryColors } from "../../utils";
import dayjs from "dayjs";
import { CommentCheckmarkRegular, CommentDismissRegular } from "@fluentui/react-icons";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";

const useStyles = makeStyles({
    chatMessage: {
        whiteSpace: 'pre-wrap'
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
    }
});

const CommentChatMessageAvatar = ({ comment }: { comment: Comment }) => <Avatar name={comment.Author} color={directoryColors.get(comment.Directory)} />;

export const CommentChatMessage = ({ comment }: { comment: Comment }) => {
    const styles = useStyles();
    const { timeZoneInfo } = useFormInitQuery();
    const timestamp = dayjs(comment.Created);
    return (
        <ChatMessage
            body={{ className: styles.chatMessage }}
            avatar={<CommentChatMessageAvatar comment={comment} />}
            author={comment.Author}
            decorationLabel={`${comment.ProcessName} / ${comment.ActivityName}`}
            timestamp={timestamp.utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
        >
            {comment.Comment}
        </ChatMessage>
    );
}

export const ApprovalCommentChatMessage = ({ comment }: { comment: Comment }) => {
    const styles = useStyles();
    const { timeZoneInfo } = useFormInitQuery();
    const timestamp = dayjs(comment.Created);
    return (
        <ChatMessage
            body={{ className: mergeClasses(styles.chatMessage, styles.chatApprovalMessage) }}
            avatar={<CommentChatMessageAvatar comment={comment} />}
            author={comment.Author}
            decorationLabel={{ className: styles.chatApprovalDecorationLabel, children: `${comment.ProcessName} / ${comment.ActivityName}` }}
            decorationIcon={{ className: styles.chatApprovalDecorationIcon, children: <CommentCheckmarkRegular /> }}
            timestamp={timestamp.utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
        >
            {comment.Comment}
        </ChatMessage>
    );
}

export const RejectionCommentChatMessage = ({ comment }: { comment: Comment }) => {
    const styles = useStyles();
    const { timeZoneInfo } = useFormInitQuery();
    const timestamp = dayjs(comment.Created);
    return (
        <ChatMessage
            body={{ className: mergeClasses(styles.chatMessage, styles.chatRejectionMessage) }}
            avatar={<CommentChatMessageAvatar comment={comment} />}
            author={comment.Author}
            decorationLabel={{ className: styles.chatRejectionDecorationLabel, children: `${comment.ProcessName} / ${comment.ActivityName}` }}
            decorationIcon={{ className: styles.chatRejectionDecorationIcon, children: <CommentDismissRegular /> }}
            timestamp={timestamp.utcOffset(timeZoneInfo.UTCOffset).format('LLL')}
        >
            {comment.Comment}
        </ChatMessage>
    );
}

export const commentChatMessages = new Map<Comment['Type'], ({ comment }: { comment: Comment }) => JSX.Element>([
    ["APPROVAL", ApprovalCommentChatMessage],
    ["REJECTION", RejectionCommentChatMessage],
    ["COMMENT", CommentChatMessage]
]);