import { Field, Text, Dropdown as FUIDropdown, mergeClasses, Option, type FieldProps, type DropdownProps as FUIDropdownProps, type TextProps } from "@fluentui/react-components";
import { useFieldContext } from "../../hooks/useWfgForm";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { DataRow } from "../../types";
import { usePrintStyles } from "./TextField";
import { useWfgFormContext } from "../Form/Provider";

type ValueText = DataRow & {
    Value: string
    Text: string
};
type DropdownProps<T extends ValueText> = {
    fieldProps?: FieldProps
    dropdownProps?: FUIDropdownProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    options: T[]
};

function PrintView<T extends ValueText>(props: DropdownProps<T>) {
    const { printFieldProps = props.fieldProps, printTextProps = {}, dropdownProps = {} } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? dropdownProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

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
function View<T extends ValueText>(props: DropdownProps<T>) {
    const { options, fieldProps, dropdownProps = {} } = props;
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const { requiredFields } = useFormInitQuery();
    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? dropdownProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

    return (
        <Field
            label={t(field.name)}
            required={required}
            validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
            {...fieldProps}
        >
            <FUIDropdown
                defaultValue={value}
                onOptionSelect={(_, data) => {
                    if (isDataRow) {
                        field.setValue(data.selectedOptions.length > 0 ? data.selectedOptions.map(v => options.find(opt => opt.Value === v)!) : []);
                        return;
                    }
                    field.setValue(data.selectedOptions.length > 0 ? data.selectedOptions.map(v => v).join(', ') : null);
                }}
                {...dropdownProps}
            >
                {options.map((opt, i) => (
                    <Option key={`option-${i}`} value={opt.Value}>{t(opt.Text)}</Option>
                ))}
            </FUIDropdown>
        </Field>
    );
}

export function Dropdown<T extends ValueText>(props: DropdownProps<T>) {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
}