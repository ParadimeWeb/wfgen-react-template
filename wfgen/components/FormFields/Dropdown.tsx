import { Field, Text, Dropdown, mergeClasses, type FieldProps, type DropdownProps as FUIDropdownProps, type TextProps, makeStyles } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import type { DataRow } from "@wfgen/types";
import { usePrintStyles } from "@wfgen/components/FormFields/TextField";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { csvToSet } from "@wfgen/utils";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { fieldStyles } from "@wfgen/styles";
import { useFieldContext } from "@wfgen/hooks/formContext";
import { useStore } from "@tanstack/react-form";

type DropdownProps = FUIDropdownProps & {
    getTextValue?: () => string
    setTextValue?: (value: string) => void
    fieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    readonlyDropdownProps?: FUIDropdownProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    readonly?: boolean
};

const useStyles = makeStyles({
    dropdown: {
        minWidth: 'auto'
    },
    ...fieldStyles
});

function PrintView(props: DropdownProps) {
    const { getTextValue, printFieldProps = props.fieldProps, printTextProps = {}, multiselect } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = 
        isDataRow ? 
            multiselect ? 
                fieldValue.map(r => t(r.Text as string)).join(', ') : 
            fieldValue.length > 0 ? 
                t(fieldValue[0].Text as string) : 
            '' : 
        getTextValue ? 
            getTextValue() : 
        fieldValue ?? '';

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
    const { getTextValue, fieldProps, readonlyFieldProps = props.fieldProps, readonlyDropdownProps = {}, printFieldProps, printTextProps, ...dropdownProps } = props;
    const styles = useStyles();
    const field = useFieldContext<DataRow[] | string | null>();
    const { form } = useWfgFormContext();
    const { t } = useTranslation();
    const fieldValue = field.state.value;
    const isDataRow = Array.isArray(fieldValue);
    const value = 
        isDataRow ? 
            dropdownProps.multiselect ? 
                fieldValue.map(r => t(r.Text as string)).join(', ') : 
            fieldValue.length > 0 ? 
                t(fieldValue[0].Text as string) : 
            '' : 
        getTextValue ?
            getTextValue() :
        fieldValue ?? '';

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
    const { getTextValue, setTextValue, fieldProps, readonlyDropdownProps, readonlyFieldProps, printFieldProps, printTextProps, ...dropdownProps } = props;
    const field = useFieldContext<DataRow[] | string | null>();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const fieldValue = field.state.value;
    const textValue = getTextValue ? getTextValue() : null;
    const isDataRow = Array.isArray(fieldValue);
    const inputValues = 
        isDataRow ? 
            dropdownProps.multiselect ? 
                fieldValue.map(r => t(r.Text as string)) : 
            fieldValue.length > 0 ? 
                [t(fieldValue[0].Text as string)] : 
            [] : 
        fieldValue ? 
            [textValue ?? fieldValue] : 
        [];
    const inputValue = inputValues.join(', ');
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
                            value={inputValue}
                            selectedOptions={inputValues}
                            onOptionSelect={(_, { optionText, optionValue, selectedOptions: selectedValues }) => {
                                if (optionValue === undefined || optionText === undefined || inputValues.includes(optionText)) {
                                    return;
                                }
                                if (selectedValues.includes(optionValue) && isDataRow && dropdownProps.multiselect) {
                                    field.pushValue({ Value: optionValue, Text: optionText });
                                    return;
                                }
                                if (selectedValues.includes(optionValue) && isDataRow) {
                                    field.handleChange([{ Value: optionValue, Text: optionText }]);
                                    return;
                                }
                                if (isDataRow && dropdownProps.multiselect) {
                                    field.removeValue(fieldValue.findIndex((r) => r.Value === optionValue));
                                    return;
                                }
                                if (selectedValues.includes(optionValue) && dropdownProps.multiselect) {
                                    field.handleChange(selectedValues.join(', '));
                                    if (setTextValue) {
                                        setTextValue([...inputValues, optionText].join(', '));
                                    }
                                    return;
                                }
                                if (selectedValues.includes(optionValue)) {
                                    field.handleChange(optionValue);
                                    if (setTextValue) {
                                        setTextValue(optionText);
                                    }
                                    return;
                                }
                                if (dropdownProps.multiselect) {
                                    const splitValue = (fieldValue as string).split(', ');
                                    splitValue.splice(splitValue.indexOf(optionValue), 1);
                                    field.handleChange(splitValue.join(', '));
                                    if (setTextValue) {
                                        inputValues.splice(inputValues.indexOf(optionText), 1);
                                        setTextValue(inputValues.join(', '));
                                    }
                                }
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
    return isPrintView ? <PrintView {...props} /> : isArchive || props.readonly === true || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
}