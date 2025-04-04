import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { Dismiss24Regular } from "@fluentui/react-icons";
import type { AnyFieldApi } from "@tanstack/react-form";

export const ApprovalsDrawer = ({ field }: { field: AnyFieldApi }) => {
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (<>
        <DrawerHeader>
            <DrawerHeaderTitle
                action={<Button
                    appearance="subtle"
                    aria-label={t('Close')}
                    icon={<Dismiss24Regular />}
                    onClick={() => { field.handleChange('CANCEL_APPROVALS'); }}
                />}
            >
                {t('Approvals')}
            </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
            <form.AppField name="__Approvals" children={field => <field.Approvals />} />
        </DrawerBody>
    </>);
};