import { Field, Text, Combobox, Option, type FieldProps, type ComboboxProps as FUIComboboxProps, type TextProps, mergeClasses, makeStyles, type OptionProps } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { DataRow } from "../../types";
import { useForm, useStore } from "@tanstack/react-form";
import { usePrintStyles } from "./TextField";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { csvToSet } from "../../utils";
import { fieldStyles } from "../../styles";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useFieldContext } from "../../hooks/formContext";
import { Children, isValidElement } from "react";

type ComboboxProps = FUIComboboxProps & {
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyComboboxProps?: FUIComboboxProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
};

const useStyles = makeStyles({
    combobox: {
        minWidth: 'auto'
    },
    ...fieldStyles
});

function PrintView(props: ComboboxProps) {
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
function ReadonlyView(props: ComboboxProps) {
    const { fieldProps, readonlyFieldProps = props.fieldProps, readonlyComboboxProps = {}, printFieldProps, printTextProps, ...comboboxProps } = props;
    const styles = useStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { form } = useWfgFormContext();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = isDataRow ? comboboxProps.multiselect ? fieldValue.map(r => t(r.Text as string)).join(', ') : fieldValue.length > 0 ? t(fieldValue[0].Text as string) : '' : fieldValue ?? '';

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
                        <Combobox 
                            input={{
                                readOnly: true,
                                className: styles.cursorReadonly
                            }}
                            expandIcon={{
                                className: styles.cursorReadonly
                            }}
                            listbox={null}
                            className={mergeClasses(styles.combobox, comboboxProps.className)}
                            defaultValue={value}
                            {...readonlyComboboxProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: ComboboxProps) {
    const { fieldProps, readonlyComboboxProps, readonlyFieldProps, printFieldProps, printTextProps, ...comboboxProps } = props;
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const selectedOptions = isDataRow ? comboboxProps.multiselect ? fieldValue.map(r => t(r.Text as string)) : fieldValue.length > 0 ? [t(fieldValue[0].Text as string)] : [] : fieldValue ? [fieldValue] : [];
    const value = selectedOptions.join(', ');
    const options = isDataRow ? Children.map(comboboxProps.children, (child) => {
        if (isValidElement(child)) {
            const optionProps = child.props as OptionProps;
            const childrenStringValue = optionProps.children as string;
            return { Value: optionProps.value ?? childrenStringValue, Text: optionProps.text ?? childrenStringValue };
        }
        return { Value: '', Text: '' };
    }) ?? [] : [];

    const defaultValues: {
        matchingOptions: { Value: string, Text: string }[]
        customSearch?: string
    } = {
        matchingOptions: [...options],
        customSearch: ''
    };
    const ddForm = useForm({
        defaultValues
    });

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <ddForm.Field 
                        name="customSearch"
                        children={(searchField) => {
                            return (
                                <Field
                                    label={t(field.name)}
                                    required={required}
                                    validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : null}
                                    {...fieldProps}
                                >
                                    <Combobox
                                        defaultValue={value}
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            const matches = options.filter((opt) => t(opt.Text).toLowerCase().indexOf(value.toLowerCase()) === 0);
                                            ddForm.setFieldValue('matchingOptions', matches);
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
                                            ddForm.setFieldValue('matchingOptions', defaultValues.matchingOptions);
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
                                        {ddForm.state.values.matchingOptions.map((opt, i) => (
                                            <Option key={`option-${i}`} value={opt.Value}>{t(opt.Text)}</Option>
                                        ))}
                                    </Combobox>
                                </Field>
                            );
                        }}
                    />
                );
            }}
        />
    );
}

export default (props: ComboboxProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
}