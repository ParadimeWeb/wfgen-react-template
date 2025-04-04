import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { Dismiss24Regular } from "@fluentui/react-icons";
import type { AnyFieldApi } from "@tanstack/react-form";

export const CommentsDrawer = ({ field }: { field: AnyFieldApi }) => {
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    const { form } = useWfgFormContext();

    return (<>
        <DrawerHeader>
            <DrawerHeaderTitle
                action={<Button
                    appearance="subtle"
                    aria-label={t('Close')}
                    icon={<Dismiss24Regular />}
                    onClick={() => { field.handleChange('CANCEL_COMMENTS'); }}
                />}
            >
                {t('Comments')}
            </DrawerHeaderTitle>
            {!isArchive && <form.AppField name="__Comments" children={field => <field.NewCommentForm />} />}
        </DrawerHeader>
        <DrawerBody>
            <form.AppField name="__Comments" children={field => <field.Comments />} />
        </DrawerBody>
    </>);
};