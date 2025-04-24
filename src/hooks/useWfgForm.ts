import { createFormHook, useForm, type AnyFieldApi } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { lazy } from "react";
import type { TableRowData } from "@fluentui/react-components";
import { postWithFormData } from "../utils";
import { fieldContext, formContext } from "./formContext";
import type { DataRow, RowAction, WfgFormData } from "../types";
import { useFormInitQuery } from "./useFormInitQuery";

const TextField = lazy(() => import('../components/FormFields/TextField'));
const RadioGroup = lazy(() => import('../components/FormFields/RadioGroup'));
const Comments = lazy(() => import('../components/Comments'));
const DatePicker = lazy(() => import('../components/FormFields/DatePicker'));
const ComplexTagPicker = lazy(() => import('../components/FormFields/ComplexTagPicker'));
const Combobox = lazy(() => import('../components/FormFields/Combobox'));
const Dropdown = lazy(() => import('../components/FormFields/Dropdown'));
const NumberField = lazy(() => import('../components/FormFields/NumberField'));
const FileField = lazy(() => import('../components/FormFields/FileField'));
const Approvals = lazy(() => import('../components/Approvals'));
const NewCommentForm = lazy(() => import('../components/Comments/NewCommentForm'));
const DataTable = lazy(() => import('../components/FormFields/DataTable'));

const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        RadioGroup,
        NumberField,
        Dropdown,
        Combobox,
        DatePicker,
        ComplexTagPicker,
        FileField,
        Comments,
        NewCommentForm,
        Approvals,
        DataTable
    },
    formComponents: {}
});

function useWfgForm() {
    const { wfgFormData } = useFormInitQuery();

    const { mutateAsync } = useMutation({
        mutationFn: async (value: WfgFormData) => {
            value.Table1[0].FORM_ACTION = 'ASYNC_SUBMIT';
            const res = await postWithFormData(value);
            return res.data;
        }
    });

    return useAppForm({
        defaultValues: wfgFormData,
        validators: {
            onSubmitAsync: async ({ value }) => {
                const result = await mutateAsync(value);
    
                if (result.error) {
                    return { ...result };
                }
                window.location.replace(result.replyTo);
                return null;
            }
        },
        onSubmitInvalid(props) {
            props.formApi.setFieldValue('Table1[0].FORM_ACTION', 'ERROR_SUBMIT');
        },
    });
}

function useWfgPrintForm() {
    const { t } = useTranslation();
    const { numberParser, numberFormat } = useFormInitQuery();
    const form = useForm({
        defaultValues: {
            open: false,
            printPageWidth: 8.5,
            printPageWidthFormatted: numberFormat.format(8.5)
        },
        validators: {
            onSubmit: type({
                printPageWidthFormatted: type.string.moreThanLength(0).narrow((s) => {
                    const n = numberParser.tryParse(s);
                    if (n === undefined) {
                        return false;
                    }
                    form.setFieldValue('printPageWidth', n);
                    return true;
                }).configure({ 
                    message: ctx => t('{{actual}} is not a valid number', { actual: ctx.actual })
                })
            })
        },
        onSubmit: ({ value }) => {
            form.setFieldValue('printPageWidthFormatted', numberFormat.format(value.printPageWidth));
        }
    });
    return form;
}

function useWfgValidationForm() {
    return useForm({
        defaultValues: {
            errors: [] as [string, string][]
        }
    });
}

export function createWfgContext() {
    return {
        form: useWfgForm(),
        printForm: useWfgPrintForm(),
        validationForm: useWfgValidationForm()
    };
}

export function useWfgDataRowForm(field: AnyFieldApi, rows: TableRowData<DataRow>[], onAction: (type: RowAction, index?: number, item?: DataRow) => void, index: number) {
    return useAppForm({
        defaultValues: { ...rows[index].item },
        onSubmitMeta: { close: false },
        onSubmit: ({ meta, value }) => {
            field.replaceValue(index, { ...value });
            if (meta.close) {
                onAction('close');
            }
        }
    });
}

export type WfgForm = ReturnType<typeof useWfgForm>;
export type WfgPrintForm = ReturnType<typeof useWfgPrintForm>;
export type WfgValidationForm = ReturnType<typeof useWfgValidationForm>;
export type DataRowForm = ReturnType<typeof useWfgDataRowForm>;