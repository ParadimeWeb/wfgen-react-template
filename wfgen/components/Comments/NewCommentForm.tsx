import { Button, Field, Textarea } from "@fluentui/react-components";
import { useForm, useStore } from "@tanstack/react-form";
import { type } from "arktype";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import dayjs from "dayjs";
import type { Comment } from "@wfgen/types";
import { CommentAddRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useFieldContext } from "@wfgen/hooks/formContext";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { csvToSet } from "@wfgen/utils";

function View() {
    const { t } = useTranslation();
    const { currentUser, configuration } = useFormInitQuery();
    const comments = useFieldContext<Comment[]>();
    const commentForm = useForm({
        defaultValues: {
            comment: ''
        },
        validators: {
            onSubmit: type({
                comment: "string > 5"
            })
        }
    });
    
    return (
        <commentForm.Field
            name="comment"
            children={(field) => {
                const addComment = async () => {
                    const validationErrors = await commentForm.validateField("comment", "submit");
                    if (validationErrors.length < 1) {
                        comments.insertValue(0, {
                            Type: "COMMENT",
                            Author: currentUser.CommonName!,
                            UserName: currentUser.UserName!,
                            Directory: currentUser.Directory!,
                            Created: dayjs().toISOString(),
                            ProcessInstId: configuration.WF_PROCESS_INST_ID,
                            ProcessName: configuration.WF_PROCESS_NAME,
                            ActivityInstId: configuration.WF_ACTIVITY_INST_ID,
                            ActivityName: configuration.WF_ACTIVITY_NAME,
                            Comment: field.state.value
                        });
                        commentForm.reset();
                    }
                };
                return (<>
                    <div className="">
                        <Field 
                            hint={t('Shift-Enter for a new line')} 
                            validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors.join(', '), { field: '', length: 6, actual: field.state.value.length }) : null}
                        >
                            <Textarea
                                resize="vertical"
                                onKeyDown={event => {
                                    if (event.key === "Enter") {
                                        if (!event.shiftKey) {
                                            event.preventDefault();
                                            addComment();
                                        }
                                    }
                                }}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </Field>
                        <commentForm.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    disabled={!canSubmit || isSubmitting}
                                    appearance="transparent"
                                    icon={<CommentAddRegular />}
                                    onClick={addComment}
                                >
                                    {t('Add Comment')}
                                </Button>
                            )}
                        />
                    </div>
                </>);
            }}
        />
    );
};

export default () => {
    const { isArchive } = useFormInitQuery();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return !isArchive && !isPrintView && !readonlyFields.has('COMMENTS') ? <View /> : null;
}