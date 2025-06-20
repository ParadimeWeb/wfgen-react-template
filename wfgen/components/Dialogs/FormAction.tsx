import dayjs from "dayjs";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Field, FluentProvider, makeStyles, Spinner, Text, Textarea, tokens } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { dialogStyles, redTheme } from "@wfgen/components/Dialogs/styles";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorDialogSurface } from "@wfgen/components/Dialogs/Error";
import { type } from "arktype";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { csvToSet, postWithFormData } from "@wfgen/utils";
import type { WfgForm } from "@wfgen/hooks/useWfgForm";

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
    }
});

function FormActionDialogSurface({ form, field, formAction }: { form: WfgForm, field: AnyFieldApi, formAction: string }) {
    const styles = useStyles();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { currentUser, configuration, wfgFormData } = useFormInitQuery();
    const { mutate, isPending } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });
    const actionForm = useForm({
        defaultValues: {
            comment: ''
        },
        onSubmit: ({ value: { comment } }) => {
            queryClient.cancelQueries({ queryKey: ['autosave'] });

            if (comment.length > 0) {
                form.state.values.__Comments.unshift({
                    Type: formAction === 'APPROVE' ? "APPROVAL" : formAction === 'REJECT' ? "REJECTION" : "COMMENT",
                    Role: ['APPRAPPROVEOVE', 'REJECT'].some(a => a === formAction) ? wfgFormData.Table1[0].FORM_APPROVAL_ROLE : null,
                    Author: currentUser.CommonName!,
                    UserName: currentUser.UserName!,
                    Directory: currentUser.Directory!,
                    Created: dayjs().toISOString(),
                    ProcessInstId: configuration.WF_PROCESS_INST_ID,
                    ProcessName: configuration.WF_PROCESS_NAME,
                    ActivityInstId: configuration.WF_ACTIVITY_INST_ID,
                    ActivityName: configuration.WF_ACTIVITY_NAME,
                    Comment: comment
                });
            }

            if (formAction === 'SUBMIT') {
                form.handleSubmit();
                return;
            }

            form.state.values.Table1[0].FORM_ACTION = `ASYNC_${formAction}`;
            mutate({ formData: form.state.values }, {
                onSuccess({ data: { error, replyTo } }) {
                    if (error) {
                        field.handleChange(`ERROR_${error}`);
                        return;
                    }
                    window.location.replace(replyTo);
                },
                onError(error) {
                    field.handleChange(`ERROR_${error.message}`);
                }
            });
        }
    });
    let title = ''; 
    let subText = '';
    let no = '';
    let yes = '';
    switch(formAction) {
        case 'SUBMIT':
            title = 'Submit Request?';
            subText = 'Submitting the request will trigger the workflow and the process will continue.';
            no = 'No, Keep Filling';
            yes = 'Yes, Submit Request';
            break;
        case 'APPROVE':
            title = 'Approve Request?';
            subText = 'Approving the request will trigger the workflow and the process will continue. You can add comments if necessary.';
            no = 'No, Keep Reviewing';
            yes = 'Yes, Approve Request';
            break;
        case 'REJECT':
            title = 'Reject Request?';
            subText = 'Rejecting the request will trigger the workflow and the process will continue. A comment is required when rejecting.';
            no = 'No, Keep Reviewing';
            yes = 'Yes, Reject Request';
            break;
        default:
            title = 'Cancel Request?';
            subText = 'Cancelling the request will permanently close it and no longer be available.';
            no = 'No, Keep Request';
            yes = 'Yes, Cancel Request';
            break;
    }
    return (
        <DialogSurface className={styles.dialogSurface}>
            <DialogBody>
                <DialogTitle 
                    className={styles.title}
                >
                    {t(title)}
                </DialogTitle>
                <DialogContent className={styles.root}>
                    <Text block>{t(subText)}</Text>
                    <form.Subscribe 
                        selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
                        children={(FORM_FIELDS_REQUIRED) => {
                            const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                            const required =    (formAction === 'APPROVE' && requiredFields.has('APPROVE_COMMENTS')) || 
                                                (formAction === 'REJECT' && requiredFields.has('REJECT_COMMENTS')) ||
                                                (formAction === 'SUBMIT' && requiredFields.has('SUBMIT_COMMENTS')) ||
                                                (formAction === 'CANCEL' && requiredFields.has('CANCEL_COMMENTS'));
                            return (
                                <actionForm.Field 
                                    name="comment"
                                    validators={required ? {
                                        onSubmit: type("string > 5")
                                    } : undefined}
                                    children={field => {
                                        return (
                                            <Field 
                                                required={required}
                                                label={t('Comment')}
                                                validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors.join(', '), { length: 6, actual: field.state.value.length }) : null}
                                            >
                                                <Textarea 
                                                    defaultValue={field.state.value}
                                                    onChange={(_, data) => { field.handleChange(data.value); }}
                                                />
                                            </Field>
                                        );
                                    }}
                                />
                                
                            );
                        }}
                    />
                </DialogContent>
                <DialogActions fluid>
                    <form.Subscribe 
                        selector={s => [s.isSubmitting]}
                        children={([isSubmitting]) => {
                            return (<>
                                <Button
                                    disabled={isPending || isSubmitting}
                                    appearance="secondary"
                                    onClick={() => { field.handleChange(`CANCEL_${formAction}`); }}
                                >
                                    {t(no)}
                                </Button>
                                <Button
                                    disabled={isPending || isSubmitting}
                                    icon={isPending ? <Spinner size="tiny" /> : null}
                                    appearance="primary"
                                    onClick={async () => { actionForm.handleSubmit(); }}
                                >
                                    {t(yes)}
                                </Button>
                            </>);
                        }}
                    />
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    );
}
export const FormActionDialog = () => {
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                const value = field.state.value as string | null;
                const actionSplit = value?.split('_') ?? [''];
                const formAction = actionSplit.length > 1 ? actionSplit[1] : actionSplit[0];
                const isError = actionSplit[0] === 'ERROR';
                const open = isError || actionSplit[0] === 'CONFIRM';
                const isRedTheme = ['CANCEL', 'REJECT'].some(v => v === formAction);
                
                return (
                    <Dialog
                        modalType="alert"
                        open={open}
                    >
                        {isError || actionSplit[0] === 'CANCELERROR' ? (
                            <ErrorDialogSurface field={field} formAction={formAction} />
                        ) : isRedTheme ? (
                            <FluentProvider theme={redTheme}>
                                <FormActionDialogSurface form={form} field={field} formAction={formAction} />
                            </FluentProvider>
                        ) : (
                            <FormActionDialogSurface form={form} field={field} formAction={formAction} />
                        )}
                    </Dialog>
                );
            }}
        />
    );
}