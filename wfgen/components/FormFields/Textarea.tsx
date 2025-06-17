import { Field, Textarea as FUITextarea, makeStyles, mergeClasses, type FieldProps, type TextareaProps as FUITextareaProps, type TextProps, Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { csvToSet } from "@wfgen/utils";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@wfgen/hooks/formContext";
import { usePrintStyles } from "./TextField";

type TextareaProps = FUITextareaProps & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyTextareaProps?: FUITextareaProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

const useTextareaPrintStyles = makeStyles({
    textarea: {
        whiteSpace: 'pre-wrap'
    },
    readonly: {
        '& textarea': {
            cursor: 'default !important'
        }
    }
});
function PrintView(props: TextareaProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {} } = props;
    const styles = usePrintStyles();
    const textareaStyles = useTextareaPrintStyles();
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();

    return (
        <Field
            label={t(field.name)}
            {...printFieldProps}
        >
            <Text 
                className={mergeClasses(styles.text, textareaStyles.textarea, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large, printTextProps.className)}
            >
                {field.state.value}
            </Text>
        </Field>
    );
}
function ReadonlyView(props: TextareaProps) {
    const { readonlyFieldProps = props.fieldProps, readonlyTextareaProps = {} } = props;
    const styles = useTextareaPrintStyles();
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        required={required}
                        label={t(field.name)}
                        {...readonlyFieldProps}
                    >
                        <FUITextarea 
                            readOnly
                            defaultValue={field.state.value ?? ''}
                            className={styles.readonly}
                            {...readonlyTextareaProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: TextareaProps) {
    const { fieldProps = {}, readonlyFieldProps, readonlyTextareaProps, printFieldProps, printTextProps, ...inputProps } = props;
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const value = field.state.value ?? '';

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        required={required}
                        label={t(field.name)}
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                        {...fieldProps}
                    >
                        <FUITextarea
                            value={value}
                            onChange={(_, { value }) => { field.handleChange(value); }}
                            onBlur={() => { field.handleBlur(); }}
                            {...inputProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
export default (props: TextareaProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || props.readOnly === true || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
};