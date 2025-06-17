import type { AnyFieldApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { dialogStyles, redTheme } from "@wfgen/components/Dialogs/styles";
import { Text, Button, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, FluentProvider, MessageBar, MessageBarBody, MessageBarTitle, makeStyles, tokens } from "@fluentui/react-components";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: tokens.spacingVerticalXXL
    },
    dialogSurface: {
        ...dialogStyles.primary,
        ...dialogStyles.top
    },
    title: {
        color: tokens.colorBrandForeground1
    },
    container: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingHorizontalXS
    }
});

export const ErrorDialogSurface = ({ field, formAction }: { field: AnyFieldApi, formAction: string }) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { validationForm } = useWfgFormContext();
    
    if (['SUBMIT', 'VALIDATION'].some(v => v === formAction)) {
        return (
            <FluentProvider theme={redTheme}>
                <DialogSurface className={styles.dialogSurface}>
                    <DialogBody>
                        <DialogTitle className={styles.title}>{t('Validation Error')}</DialogTitle>
                        <DialogContent className={styles.root}>
                            <Text block>{t('You need to fix these issues first')}</Text>
                            <div className={styles.container}>
                                {validationForm.state.values.errors.map((error, index) => {
                                    return (
                                        <MessageBar key={`validationError-${index}`} intent="error">
                                            <MessageBarBody>
                                                <MessageBarTitle>{t(error[1])}</MessageBarTitle>
                                                {t(error[0])}
                                            </MessageBarBody>
                                        </MessageBar>
                                    );
                                })}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                appearance="secondary"
                                onClick={() => {
                                    field.handleChange(`CANCELERROR_SUBMIT`);
                                }}
                            >{t('OK')}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </FluentProvider>
        );
    }

    const errors = field.form.getAllErrors();
    const error = errors.form.errors.length > 0 ? errors.form.errors[0].error : formAction;
    return (
        <FluentProvider theme={redTheme}>
            <DialogSurface className={styles.dialogSurface}>
                <DialogBody>
                    <DialogTitle className={styles.title}>{t('Server Error')}</DialogTitle>
                    <DialogContent className={styles.root}>
                        <Text block>{t('Oh no! Something wrong happened.')}</Text>
                        <Text>{t(error)}</Text>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            appearance="secondary"
                            onClick={() => {
                                field.handleChange(`CANCELERROR_${error}`);
                            }}
                        >{t('OK')}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </FluentProvider>
    );
};