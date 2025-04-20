import { Chat } from "@fluentui-contrib/react-chat";
import { commentChatMessages } from "./CommentChatMessage";
import type { Comment } from "../../types";
import { makeStyles } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/formContext";

const useStyles = makeStyles({
    root: {
        width: 'unset',
        marginRight: 'unset',
        marginLeft: 'unset'
    }
});
export default () => {
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