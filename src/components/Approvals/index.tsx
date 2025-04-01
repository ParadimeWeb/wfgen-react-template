import { Chat } from "@fluentui-contrib/react-chat";
import { useFieldContext } from "../../hooks/useWfgForm";
import type { Approval } from "../../types";
import { Divider, makeStyles } from "@fluentui/react-components";
import { ApprovalChatMessage } from "./ApprovalChatMessage";
import { t } from "i18next";
import { Fragment } from "react/jsx-runtime";

const useStyles = makeStyles({
    root: {
        width: 'unset'
    }
});
export const Approvals = () => {
    const styles = useStyles();
    const approvals = useFieldContext<Approval[]>();
    return approvals.state.value.map((approval, index) => {
        return (
            <Fragment key={index}>
                <Divider>{t(approval.Role)}</Divider>
                <Chat className={styles.root}>
                    <ApprovalChatMessage approval={approval} />
                </Chat>
            </Fragment>
        );
    });
};