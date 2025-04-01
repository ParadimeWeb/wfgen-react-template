import { Button, Field, mergeClasses, Text, type FieldProps, type TextProps } from "@fluentui/react-components"
import { DatePicker as FUIDatePicker, type DatePickerProps as FUIDatePickerProps } from "@fluentui/react-datepicker-compat"
import { useTranslation } from "react-i18next"
import { useFieldContext } from "../../hooks/useWfgForm"
import { useFormInitQuery } from "../../hooks/useFormInitQuery"
import dayjs from "dayjs"
import { DismissRegular } from "@fluentui/react-icons"
import { useWfgFormContext } from "../Form/Provider"
import { useMemo } from "react"
import { usePrintStyles } from "./TextField"

type DatePickerProps = {
    fieldProps?: FieldProps
    datePickerProps?: FUIDatePickerProps
    printFieldProps?: FieldProps
    printTextProps?: TextProps
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
function View(props: DatePickerProps) {
    const { fieldProps = {}, datePickerProps = {} } = props;
    const field = useFieldContext<string | null>();
    const { t } = useTranslation();
    const { locale, requiredFields } = useFormInitQuery();
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
    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
    const value = toDate(field.state.value);

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
}
export const DatePicker = (props: DatePickerProps) => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
};