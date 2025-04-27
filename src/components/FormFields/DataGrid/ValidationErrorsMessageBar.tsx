import { makeStyles, MessageBar, MessageBarBody, MessageBarTitle, shorthands } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { DataRowForm } from "../../../hooks/useWfgForm";

const useStyles = makeStyles({
    root: {
        ...shorthands.borderWidth(0)
    }
});
export const ValidationErrorsMessageBar = (props: { form: DataRowForm }) => {
    const { form } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    return (
        <form.Subscribe 
            selector={s => s.errorMap}
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
                    </MessageBar>
                );
            }}
        />
    );
}