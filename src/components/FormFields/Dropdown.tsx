import { Field, Text, Dropdown, mergeClasses, type FieldProps, type DropdownProps as FUIDropdownProps, type TextProps, makeStyles, type OptionProps } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { DataRow } from "../../types";
import { usePrintStyles } from "./TextField";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { csvToSet } from "../../utils";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { fieldStyles } from "../../styles";
import { useFieldContext } from "../../hooks/formContext";
import { useStore } from "@tanstack/react-form";
import { Children, isValidElement } from "react";

type DropdownProps = FUIDropdownProps & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyDropdownProps?: FUIDropdownProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

const useStyles = makeStyles({
    dropdown: {
        minWidth: 'auto'
    },
    ...fieldStyles
});

function PrintView(props: DropdownProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {}, multiselect } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

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
function ReadonlyView(props: DropdownProps) {
    const { fieldProps, readonlyFieldProps = props.fieldProps, readonlyDropdownProps = {}, printFieldProps, printTextProps, ...dropdownProps } = props;
    const styles = useStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { form } = useWfgFormContext();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? dropdownProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

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
                        <Dropdown
                            defaultValue={value}
                            button={{ className: styles.cursorReadonly }}
                            listbox={null}
                            className={mergeClasses(styles.dropdown, dropdownProps.className)}
                            {...readonlyDropdownProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: DropdownProps) {
    const { fieldProps, readonlyDropdownProps, readonlyFieldProps, printFieldProps, printTextProps, ...dropdownProps } = props;
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const selectedOptions = isDataRow ? dropdownProps.multiselect ? fieldValue.map(r => t(r.Text as string)) : fieldValue.length > 0 ? [t(fieldValue[0].Text as string)] : [] : fieldValue ? [fieldValue] : [];
    const value = selectedOptions.join(', ');
    const options = isDataRow ? Children.map(dropdownProps.children, (child) => {
        if (isValidElement(child)) {
            const optionProps = child.props as OptionProps;
            const childrenStringValue = optionProps.children as string;
            return { Value: optionProps.value ?? childrenStringValue, Text: optionProps.text ?? childrenStringValue };
        }
        return { Value: '', Text: '' };
    }) ?? [] : [];
    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        label={t(field.name)}
                        required={required}
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                        {...fieldProps}
                    >
                        <Dropdown
                            defaultValue={value}
                            defaultSelectedOptions={selectedOptions}
                            onOptionSelect={(_, data) => {
                                if (isDataRow) {
                                    field.setValue(data.selectedOptions.length > 0 ? data.selectedOptions.map(v => options.find(opt => opt.Value === v)!) : []);
                                    return;
                                }
                                field.setValue(data.selectedOptions.length > 0 ? data.selectedOptions.map(v => v).join(', ') : null);
                            }}
                            {...dropdownProps}
                        />
                    </Field>
                );
            }}
        />
    );
}

export default (props: DropdownProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
}