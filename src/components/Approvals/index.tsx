import { Chat } from "@fluentui-contrib/react-chat";
import type { Approval } from "../../types";
import { Divider, makeStyles } from "@fluentui/react-components";
import { ApprovalChatMessage } from "./ApprovalChatMessage";
import { t } from "i18next";
import { Fragment } from "react/jsx-runtime";
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
    const approvals = useFieldContext<Approval[]>();
    return (
        <div>
            {approvals.state.value.map((approval, index) => {
                return (
                    <Fragment key={index}>
                        <Divider>{t(approval.Role)}</Divider>
                        <Chat className={styles.root}>
                            <ApprovalChatMessage approval={approval} />
                        </Chat>
                    </Fragment>
                );
            })}
        </div>
    );
};