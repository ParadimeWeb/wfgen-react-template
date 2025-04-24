import { Button, makeStyles, MessageBar, MessageBarActions, MessageBarBody, MessageBarTitle, shorthands } from "@fluentui/react-components";
import { InfoRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../hooks/useWfgFormContext";
import { ArkError } from "arktype";

const useStyles = makeStyles({
    root: {
        ...shorthands.borderWidth(0)
    }
});
export const ValidationErrorsMessageBar = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form, validationForm } = useWfgFormContext();
    
    return (
        <form.Subscribe 
            selector={s => s.errorMap}
            children={() => {
                const errors = form.getAllErrors();
                const fieldErrors = Object.keys(errors.fields);
                if (fieldErrors.length < 1) {
                    validationForm.reset();
                    return null;
                }
                validationForm.setFieldValue('errors', fieldErrors.map((field) => {
                    if (errors.fields[field].errors[0] instanceof ArkError) { 
                        const error = errors.fields[field].errors[0];
                        return [t(error.message, { length: error.rule, actual: error.data.length }), t(field)] as [string, string];
                    }
                    const error = errors.fields[field].errors as string[];
                    return [t(error[0]), t(error[1])] as [string, string];
                }));
                return (
                    <MessageBar
                        shape="square"
                        intent="error"
                        className={styles.root}
                    >
                        <MessageBarBody>
                            <MessageBarTitle>{t('Validation Error')}</MessageBarTitle>
                            {t('{{count}} validation error', { count: fieldErrors.length })}
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