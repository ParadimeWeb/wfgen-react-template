import { Text, Field, Checkbox, mergeClasses, type FieldProps, type CheckboxProps as FUICheckboxProps, type TextProps } from "@fluentui/react-components";
import { useFieldContext } from "@wfgen/hooks/formContext";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { csvToSet } from "@wfgen/utils";
import { usePrintStyles } from "@wfgen/components/FormFields/TextField";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { useStore } from "@tanstack/react-form";

type CheckboxProps = Partial<FUICheckboxProps> & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyCheckboxProps?: Partial<FUICheckboxProps>
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

function PrintView(props: CheckboxProps) {
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
                {field.state.value === 'Y' ? t('Yes') : t('No')}
            </Text>
        </Field>
    );
}
function ReadonlyView(props: CheckboxProps) {
    const { fieldProps = {}, readonlyFieldProps = props.fieldProps, readonlyCheckboxProps, printFieldProps, printTextProps, ...checkboxProps } = props;
    const field = useFieldContext<string | null>();
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
                        {...readonlyFieldProps}
                    >
                        <Checkbox 
                            onChange={() => {}}
                            checked={field.state.value === 'Y'}
                            {...{ ...checkboxProps, ...readonlyCheckboxProps }}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: CheckboxProps) {
    const { fieldProps = {}, readonlyFieldProps, readonlyCheckboxProps, printFieldProps, printTextProps, ...checkboxProps } = props;
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const checked = field.state.value === 'Y';

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        required={required}
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                        {...fieldProps}
                    >
                        <Checkbox 
                            checked={checked}
                            onChange={(_, { checked }) => { field.handleChange(checked === 'mixed' ? 'N' : checked ? 'Y' : 'N'); }}
                            {...checkboxProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
export default (props: CheckboxProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || props.readOnly === true || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
};