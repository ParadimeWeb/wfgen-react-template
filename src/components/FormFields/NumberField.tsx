import { Field, Input, mergeClasses, Text, type FieldProps, type InputProps, type TextProps } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/useWfgForm";
import { NumberParser } from "../../utils";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useTranslation } from "react-i18next";
import { NumberRowRegular } from "@fluentui/react-icons";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { usePrintStyles } from "./TextField";
import { useWfgFormContext } from "../Form/Provider";

type NumberFieldProps = {
    fieldProps?: FieldProps
    inputProps?: InputProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    style?: "decimal" | "percent" | "currency" | "unit"
    currency?: 'USD' | 'CAD'
};

function PrintView(props: NumberFieldProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {}, style = 'decimal', currency = 'USD' } = props;
    const styles = usePrintStyles();
    const { t } = useTranslation();
    const field = useFieldContext<number | null>();
    const { locale } = useFormInitQuery();
    const numberFormat = Intl.NumberFormat(locale, { style, currency });

    return (
        <Field
            label={t(field.name)}
            {...printFieldProps}
        >
            <Text 
                className={mergeClasses(styles.text, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large, printTextProps.className)}
            >
                {field.state.value === null ? '' : numberFormat.format(field.state.value)}
            </Text>
        </Field>
    );
}
function View(props: NumberFieldProps) {
    const { fieldProps = {}, inputProps = {}, style = 'decimal', currency = 'USD' } = props;
    const { t } = useTranslation();
    const field = useFieldContext<number | null>();
    const { locale, requiredFields } = useFormInitQuery();
    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
    const parts = Intl.NumberFormat(locale, { style, currency }).formatToParts();
    const currencySign = parts.find(p => p.type === 'currency')?.value ?? '';
    const percentSign = parts.find(p => p.type === 'percentSign')?.value ?? '';
    const numberFormat = Intl.NumberFormat(locale, style === 'currency' ? { maximumFractionDigits: 2, minimumFractionDigits: 2 } : style === 'percent' ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : undefined);
    const numberParser = new NumberParser(locale);
    const value = field.state.value === null ? null : style === 'percent' ? field.state.value*100 : field.state.value;
    const form = useForm({
        defaultValues: {
            formattedValue: value === null ? '' : numberFormat.format(value)
        },
        validators: {
            onChange: type({
                formattedValue: type.string.narrow((s) => {
                    if (s.length === 0) {
                        field.handleChange(null);
                        return true;
                    }
                    const n = numberParser.tryParse(s);
                    if (n === undefined) {
                        return false;
                    }
                    field.handleChange(style === 'percent' ? n/100 : n);
                    return true;
                }).configure({
                    message: ctx => t('{{actual}} is not a valid number', { actual: ctx.actual })
                })
            })
        }
    });
    
    return (
        <form.Field 
            name="formattedValue"
            children={(formattedField) => {
                return (
                    <Field
                        required={required}
                        label={t(field.name)}
                        validationMessage={formattedField.state.meta.isTouched && formattedField.state.meta.errors.length ? formattedField.state.meta.errors[0]?.message : field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0], { length: field.state.meta.errors[0].rule, actual: formattedField.state.value.length }) : null}
                        {...fieldProps}
                    >
                        <Input
                            contentAfter={style === 'currency' ? <Text size={400}>{currencySign}</Text> : style === 'percent' ? <Text size={400}>{percentSign}</Text> : <NumberRowRegular />}
                            value={formattedField.state.value}
                            onBlur={() => {
                                if (form.state.isValid && value !== null) {
                                    if (!Number.isInteger(value)) {
                                        if (style === 'percent') {
                                            field.setValue(Math.round(value)/100);
                                        }
                                        else if (style === 'currency' && value.toString().split('.')[1].length > 2) {
                                            field.setValue(Math.round(value * 100) / 100);
                                        }
                                    }
                                    formattedField.setValue(numberFormat.format(value));
                                }
                            }}
                            onChange={(_, { value }) => {
                                formattedField.handleChange(value);
                            }}
                            {...inputProps}
                        />
                    </Field>
                );
            }}
        />
    );
}

export const NumberField = (props: NumberFieldProps) => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
}