import { Field, Input, makeStyles, mergeClasses, tokens, type FieldProps, type InputProps, type TextProps, Text, typographyStyles } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/useWfgForm";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../Form/Provider";

type TextFieldProps = {
    fieldProps?: FieldProps
    inputProps?: InputProps
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
function View(props: TextFieldProps) {
    const { fieldProps = {}, inputProps = {} } = props;
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { requiredFields } = useFormInitQuery();
    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
    const value = field.state.value ?? '';

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
}
export const TextField = (props: TextFieldProps) => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
}