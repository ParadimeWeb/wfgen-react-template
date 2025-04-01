import { Chat } from "@fluentui-contrib/react-chat";
import { commentChatMessages } from "./CommentChatMessage";
import { useFieldContext } from "../../hooks/useWfgForm";
import type { Comment } from "../../types";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        width: 'unset'
    }
});
export const Comments = () => {
    const styles = useStyles();
    const comments = useFieldContext<Comment[]>();
    return (
        <Chat className={styles.root}>
            {comments.state.value.map((comment, i) => {
                const CommentChatMessage = commentChatMessages.get(comment.Type)!;
                return <CommentChatMessage key={i} comment={comment} />;
            })}
        </Chat>
    );
};