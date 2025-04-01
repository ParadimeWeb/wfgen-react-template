import { Button, makeStyles, MessageBar, MessageBarActions, MessageBarBody, MessageBarTitle, shorthands } from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "./Form/Provider";

const useStyles = makeStyles({
    root: {
        ...shorthands.borderWidth(0)
    }
});
export const ValidationErrorsMessageBar = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    return (
        <form.Subscribe 
            selector={s => s.submissionAttempts}
            children={() => {
                const errors = form.getAllErrors();
                const count = Object.keys(errors.fields).length;
                if (count < 1) {
                    return null;
                }
                return (
                    <MessageBar
                        shape="square"
                        intent="error"
                        className={styles.root}
                    >
                        <MessageBarBody>
                            <MessageBarTitle>{t('Validation Error')}</MessageBarTitle>
                            {t('{{count}} validation error', { count })}
                        </MessageBarBody>
                        <MessageBarActions>
                            <Button 
                                appearance="transparent" 
                                icon={<InfoRegular />}
                                onClick={() => { form.setFieldValue('Table1[0].FORM_ACTION', 'ERROR_VALIDATION'); }}
                            />
                        </MessageBarActions>
                    </MessageBar>
                );
            }}
        />
    );
}