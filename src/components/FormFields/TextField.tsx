import { Field, Input, makeStyles, mergeClasses, tokens, type FieldProps, type InputProps, type TextProps, Text, typographyStyles } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { csvToSet } from "../../utils";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../../hooks/formContext";

type TextFieldProps = InputProps & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyInputProps?: InputProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

export const usePrintStyles = makeStyles({
    text: {
        minHeight: '32px',
        ...typographyStyles.body1,
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: `0 ${tokens.spacingHorizontalM}`
    },
    small: {
        minHeight: '24px',
        ...typographyStyles.caption1,
        padding: `0 ${tokens.spacingHorizontalS}`
    },
    large: {
        minHeight: '40px',
        ...typographyStyles.body2,
        padding: `0 calc(${tokens.spacingHorizontalM} + ${tokens.spacingHorizontalSNudge})`
    },
    readonly: {
        '& input': {
            cursor: 'default !important'
        }
    }
});
function PrintView(props: TextFieldProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {} } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();

    return (
        <Field
            label={t(field.name)}
            {...printFieldProps}
        >
            <Text 
                className={mergeClasses(styles.text, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large, printTextProps.className)}
            >
                {field.state.value}
            </Text>
        </Field>
    );
}
function ReadonlyView(props: TextFieldProps) {
    const { readonlyFieldProps = props.fieldProps, readonlyInputProps = {} } = props;
    const styles = usePrintStyles();
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
                        <Input 
                            readOnly
                            defaultValue={field.state.value ?? ''}
                            className={styles.readonly}
                            {...readonlyInputProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: TextFieldProps) {
    const { fieldProps = {}, readonlyFieldProps, readonlyInputProps, printFieldProps, printTextProps, ...inputProps } = props;
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
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0], { length: field.state.meta.errors[0].rule, actual: value.length }) : null}
                        {...fieldProps}
                    >
                        <Input
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
export default (props: TextFieldProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
};