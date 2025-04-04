import { Text, Field, RadioGroup, makeStyles, mergeClasses, type FieldProps, type RadioGroupProps as FUIRadioGroupProps, type TextProps } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/formContext";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { csvToSet } from "../../utils";
import { usePrintStyles } from "./TextField";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useStore } from "@tanstack/react-form";

type RadioGroupProps = Partial<FUIRadioGroupProps> & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyRadioGroupProps?: Partial<FUIRadioGroupProps>
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

const useStyles = makeStyles({
    readonly: {
        '& .fui-Radio__input, & .fui-Radio__label': {
            cursor: 'default !important'
        }
    }
});

function PrintView(props: RadioGroupProps) {
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
function ReadonlyView(props: RadioGroupProps) {
    const { readonlyFieldProps = props.fieldProps, readonlyRadioGroupProps = {} } = props;
    const styles = useStyles();
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
                        <RadioGroup 
                            onChange={() => {}}
                            value={field.state.value ?? ''}
                            {...readonlyRadioGroupProps}
                            className={mergeClasses(styles.readonly, readonlyRadioGroupProps.className)}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: RadioGroupProps) {
    const { fieldProps = {}, readonlyFieldProps, readonlyRadioGroupProps, printFieldProps, printTextProps, ...radioGroupProps } = props;
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
                        <RadioGroup 
                            value={value}
                            onChange={(_, { value }) => { field.handleChange(value); }}
                            {...radioGroupProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
export default (props: RadioGroupProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
};