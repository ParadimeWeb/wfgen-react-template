import { Field, Text, Combobox as FUICombobox, Option, type FieldProps, type ComboboxProps as FUIComboboxProps, type TextProps, mergeClasses } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/useWfgForm";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { DataRow } from "../../types";
import { useForm } from "@tanstack/react-form";
import { usePrintStyles } from "./TextField";
import { useWfgFormContext } from "../Form/Provider";

type ValueText = DataRow & {
    Value: string
    Text: string
};
type ComboboxProps<T extends ValueText> = {
    fieldProps?: FieldProps
    comboboxProps?: FUIComboboxProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    options: T[]
};

function PrintView<T extends ValueText>(props: ComboboxProps<T>) {
    const { printFieldProps = props.fieldProps, printTextProps = {}, comboboxProps = {} } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? comboboxProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

    return (
        <Field
            label={t(field.name)}
            {...printFieldProps}
        >
            <Text 
                className={mergeClasses(styles.text, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large, printTextProps.className)}
            >
                {value}
            </Text>
        </Field>
    );
}
function View<T extends ValueText>(props: ComboboxProps<T>) {
    const { options, fieldProps, comboboxProps = {} } = props;
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const { requiredFields } = useFormInitQuery();
    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? comboboxProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';
    const defaultValues: {
        matchingOptions: T[]
        customSearch?: string
    } = {
        matchingOptions: [...options],
        customSearch: ''
    };
    const form = useForm({
        defaultValues
    });

    return (
        <form.Field 
            name="customSearch"
            children={(searchField) => {
                return (
                    <Field
                        label={t(field.name)}
                        required={required}
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                        {...fieldProps}
                    >
                        <FUICombobox
                            defaultValue={value}
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                const matches = options.filter((opt) => t(opt.Text).toLowerCase().indexOf(value.toLowerCase()) === 0);
                                form.setFieldValue('matchingOptions', matches);
                                if (value.length && matches.length < 1) {
                                    searchField.setValue(value);
                                }
                                else {
                                    searchField.setValue(undefined);
                                }
                            }}
                            onOptionSelect={(_, data) => {
                                const matchingOption = data.optionText && options.some((opt) => {
                                    const optTextLowered = t(opt.Text).toLowerCase();
                                    return optTextLowered === data.optionText?.toLowerCase() || optTextLowered === (data.optionText!).toLowerCase();
                                });
                                form.setFieldValue('matchingOptions', defaultValues.matchingOptions);
                                if (matchingOption) {
                                    searchField.setValue(undefined);
                                }
                                else {
                                    searchField.setValue(data.optionText);
                                }

                                if (comboboxProps.multiselect) {
                                    if (isDataRow) {
                                        field.setValue(
                                            data.selectedOptions.length > 0 ? data.selectedOptions.map(v => {
                                                const selectedOption = options.find(opt => opt.Value === v);
                                                return selectedOption ?? { Value: data.optionValue!, Text: data.optionText! };
                                            }) 
                                            : []);
                                        return;
                                    }
                                    field.setValue(data.selectedOptions.length > 0 ? data.selectedOptions.map(v => v).join(', ') : null);
                                    return;
                                }
                                if (isDataRow) {
                                    const selectedOption = data.selectedOptions.length > 0 ? options.find(opt => opt.Value === data.optionValue) : null;
                                    field.setValue(selectedOption !== null ? selectedOption ? [selectedOption] : [{ Value: data.optionValue!, Text: data.optionText! }] : []);
                                    return;
                                }
                                field.setValue(data.optionValue ?? null);
                            }}
                            {...comboboxProps}
                        >
                            {searchField.state.value ? <Option key="freeform" text={searchField.state.value}>{searchField.state.value}</Option> : null}
                            {form.state.values.matchingOptions.map((opt, i) => (
                                <Option key={`option-${i}`} value={opt.Value}>{t(opt.Text)}</Option>
                            ))}
                        </FUICombobox>
                    </Field>
                );
            }}
        />
    );
}

export function Combobox<T extends ValueText>(props: ComboboxProps<T>) {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
}