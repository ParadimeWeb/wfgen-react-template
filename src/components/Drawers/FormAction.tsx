import { OverlayDrawer } from "@fluentui/react-components";
import { useWfgFormContext } from "../Form/Provider";
import { CommentsDrawer } from "./Comments";
import { ApprovalsDrawer } from "./Approvals";

export const FormActionDrawer = () => {
    const { form } = useWfgFormContext();
    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                const actionSplit = field.state.value?.split('_') ?? [''];
                const formAction = actionSplit.length > 1 ? actionSplit[1] : actionSplit[0];
                const open = actionSplit[0] === 'DRAWER';

                return (
                    <OverlayDrawer
                        position="end"
                        size="medium"
                        open={open}
                        onOpenChange={(_, data) => {
                            if (!data.open) {
                                field.handleChange(`CANCEL_${formAction}`);
                            }
                        }}
                    >
                        {formAction === 'COMMENTS' ? <CommentsDrawer field={field} /> : formAction === 'APPROVALS' ? <ApprovalsDrawer field={field} /> : null}
                    </OverlayDrawer>
                );
            }}
        />
    );
};