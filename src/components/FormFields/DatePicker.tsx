import { Button, Field, mergeClasses, Text, type FieldProps, type TextProps } from "@fluentui/react-components"
import { DatePicker as FUIDatePicker, type DatePickerProps as FUIDatePickerProps } from "@fluentui/react-datepicker-compat"
import { useTranslation } from "react-i18next"
import { useFormInitQuery } from "../../hooks/useFormInitQuery"
import dayjs from "dayjs"
import { DismissRegular } from "@fluentui/react-icons"
import { useMemo } from "react"
import { usePrintStyles } from "./TextField"
import { csvToSet } from "../../utils"
import { useWfgFormContext } from "../../hooks/useWfgFormContext"
import { useFieldContext } from "../../hooks/formContext"
import { useStore } from "@tanstack/react-form"

type DatePickerProps = {
    fieldProps?: FieldProps
    datePickerProps?: FUIDatePickerProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
    readonlyFieldProps?: FieldProps
    readonlyDatePickerProps?: FUIDatePickerProps
};

export const toDate = (value?: string | null) => {
    if (value === undefined || value === null || value.length < 10) {
        return undefined;
    }
    return dayjs(value.substring(0, 10), 'YYYY-MM-DD');
};

function PrintView(props: DatePickerProps) {
    const { printFieldProps = props.fieldProps, printTextProps = {} } = props;
    const styles = usePrintStyles();
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const value = toDate(field.state.value);

    return (
        <Field
            label={t(field.name)}
            {...printFieldProps}
        >
            <Text
                className={mergeClasses(styles.text, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large, printTextProps.className)}
            >
                {value?.format('LL') ?? ''}
            </Text>
        </Field>
    );
}
function ReadonlyView(props: DatePickerProps) {
    const { readonlyFieldProps = props.fieldProps, readonlyDatePickerProps = {} } = props;
    const field = useFieldContext<string | null>();
    const { form } = useWfgFormContext();
    const { t } = useTranslation();
    const value = toDate(field.state.value);

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
                        <FUIDatePicker 
                            readOnly
                            popupSurface={null}
                            formatDate={() => {
                                return value?.format('LL') ?? '';
                            }}
                            value={value?.toDate() ?? null}
                            {...readonlyDatePickerProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
function View(props: DatePickerProps) {
    const { fieldProps = {}, datePickerProps = {} } = props;
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { locale } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const strings = useMemo(() => ({
        days: dayjs.weekdays(),
        goToToday: t('Go to today'),
        months: dayjs.months(),
        nextMonthAriaLabel: t('Go to next month'),
        nextYearAriaLabel: t('Go to next year'),
        prevMonthAriaLabel: t('Go to previous month'),
        prevYearAriaLabel: t('Go to previous year'),
        shortDays: dayjs.weekdaysMin(),
        shortMonths: dayjs.monthsShort()
    }), [locale]);
    const value = toDate(field.state.value);

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
                        <FUIDatePicker 
                            strings={strings}
                            contentBefore={
                                <Button 
                                    appearance="transparent" 
                                    size="small" 
                                    disabled={datePickerProps.value === null} 
                                    icon={<DismissRegular />} 
                                    onClick={() => { field.handleChange(null); }} 
                                />
                            }
                            formatDate={() => {
                                return value?.format('LL') ?? '';
                            }}
                            value={value?.toDate() ?? null}
                            onSelectDate={(date) => {
                                field.handleChange(date ? dayjs(date).format('YYYY-MM-DD') : null);
                            }}
                            {...datePickerProps}
                        />
                    </Field>
                );
            }}
        />
    );
}
export default (props: DatePickerProps) => {
    const field = useFieldContext();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} /> : <View {...props} />;
};