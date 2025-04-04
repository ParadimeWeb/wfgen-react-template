import { createFormHook, useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "@tanstack/react-query";
import type { ActionResult, WfgFormData } from "../types";
import { useFormInitQuery } from "./useFormInitQuery";
import { useTranslation } from "react-i18next";
import { post } from "../utils";
import { fieldContext, formContext } from "./formContext";
import { lazy } from "react";

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

export const { useAppForm } = createFormHook({
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
        Approvals
    },
    formComponents: {}
});

export function useWfgForm() {
    const { wfgFormData } = useFormInitQuery();

    const { mutateAsync } = useMutation({
        mutationFn: async (value: WfgFormData) => {
            value.Table1[0].FORM_ACTION = 'ASYNC_SUBMIT';
            const data = new FormData();
            data.set('FormData', new Blob([JSON.stringify(value)], { type: 'application/json' }), 'FormDataJson');
            const res = await post<ActionResult>('ASYNC_SUBMIT', { data });
            return res.data;
        },
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

export function useWfgPrintForm() {
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

export type WfgForm = ReturnType<typeof useWfgForm>;
export type WfgPrintForm = ReturnType<typeof useWfgPrintForm>;