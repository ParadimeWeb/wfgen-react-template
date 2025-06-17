import { Field, Input, mergeClasses, Text, type FieldProps, type InputProps, type TextProps } from "@fluentui/react-components";
import { csvToSet, NumberParser } from "@wfgen/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { type } from "arktype";
import { useTranslation } from "react-i18next";
import { NumberRowRegular } from "@fluentui/react-icons";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { usePrintStyles } from "@wfgen/components/FormFields/TextField";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { useFieldContext } from "@wfgen/hooks/formContext";

type NumberFieldProps = InputProps & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyInputProps?: InputProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    options?: Intl.NumberFormatOptions
};

function PrintView(props: NumberFieldProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {}, options = {} } = props;
    const styles = usePrintStyles();
    const { t } = useTranslation();
    const field = useFieldContext<number | null>();
    const { locale } = useFormInitQuery();
    const numberFormat = Intl.NumberFormat(locale, options);

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
function ReadonlyView(props: NumberFieldProps) {
    const { readonlyFieldProps = props.fieldProps, readonlyInputProps = {}, options = {} } = props;
    const styles = usePrintStyles();
    const { t } = useTranslation();
    const field = useFieldContext<number | null>();
    const { locale } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const parts = Intl.NumberFormat(locale, { style: options.style, currency: options.currency }).formatToParts();
    const currencySign = parts.find(p => p.type === 'currency')?.value ?? '';
    const percentSign = parts.find(p => p.type === 'percentSign')?.value ?? '';
    const numberFormat = Intl.NumberFormat(locale, options.style === 'currency' ? { maximumFractionDigits: 2, minimumFractionDigits: 2 } : options.style === 'percent' ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : options);

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
                            className={styles.readonly}
                            contentAfter={options.style === 'currency' ? <Text size={400}>{currencySign}</Text> : options.style === 'percent' ? <Text size={400}>{percentSign}</Text> : <NumberRowRegular />}
                            defaultValue={field.state.value === null ? '' : numberFormat.format(field.state.value)}
                            {...readonlyInputProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: NumberFieldProps) {
    const { fieldProps = {}, readonlyFieldProps, readonlyInputProps, printFieldProps, printTextProps, options = {}, ...inputProps } = props;
    const { t } = useTranslation();
    const field = useFieldContext<number | null>();
    const { locale } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const parts = Intl.NumberFormat(locale, { style: options.style, currency: options.currency }).formatToParts();
    const currencySign = parts.find(p => p.type === 'currency')?.value ?? '';
    const percentSign = parts.find(p => p.type === 'percentSign')?.value ?? '';
    const numberFormat = Intl.NumberFormat(locale, options.style === 'currency' ? { maximumFractionDigits: 2, minimumFractionDigits: 2 } : options.style === 'percent' ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : options);
    const numberParser = new NumberParser(locale);
    const value = field.state.value === null ? null : options.style === 'percent' ? field.state.value*100 : field.state.value;
    const numberForm = useForm({
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
                    field.handleChange(options.style === 'percent' ? n/100 : n);
                    return true;
                }).configure({
                    message: ctx => t('{{actual}} is not a valid number', { actual: ctx.actual })
                })
            })
        }
    });
    
    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <numberForm.Field 
                        name="formattedValue"
                        children={(formattedField) => {
                            return (
                                <Field
                                    required={required}
                                    label={t(field.name)}
                                    validationMessage={formattedField.state.meta.isTouched && formattedField.state.meta.errors.length ? formattedField.state.meta.errors[0]?.message : field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                                    {...fieldProps}
                                >
                                    <Input
                                        contentAfter={options.style === 'currency' ? <Text size={400}>{currencySign}</Text> : options.style === 'percent' ? <Text size={400}>{percentSign}</Text> : <NumberRowRegular />}
                                        value={formattedField.state.value}
                                        onBlur={() => {
                                            if (value !== null) {
                                                if (!Number.isInteger(value)) {
                                                    if (options.style === 'percent') {
                                                        field.setValue(Math.round(value)/100);
                                                    }
                                                    else if (options.style === 'currency' && value.toString().split('.')[1].length > 2) {
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
            }}
        />
    );
}

export default (_props: NumberFieldProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    const props: NumberFieldProps = { ..._props, options: { style: 'decimal', currency: 'USD', ..._props.options } };
    return isPrintView ? <PrintView {...props} /> : isArchive || props.readOnly === true || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
}