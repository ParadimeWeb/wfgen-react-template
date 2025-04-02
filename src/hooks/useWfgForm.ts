import { createFormHook, createFormHookContexts, useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "@tanstack/react-query";
import type { ActionResult, WfgFormData } from "../types";
import { post } from "../main";
import { useFormInitQuery } from "./useFormInitQuery";
import { TextField } from "../components/FormFields/TextField";
import { Comments } from "../components/Comments";
import { NumberField } from "../components/FormFields/NumberField";
import { DatePicker } from "../components/FormFields/DatePicker";
import { ComplexTagPicker } from "../components/FormFields/ComplexTagPicker";
import { Combobox } from "../components/FormFields/Combobox";
import { Dropdown } from "../components/FormFields/Dropdown";
import { useTranslation } from "react-i18next";
import { NewCommentForm } from "../components/Comments/NewCommentForm";
import { Approvals } from "../components/Approvals";
import { FileField } from "../components/FormFields/FileField";

const formHookContexts = createFormHookContexts();
const { fieldContext, formContext } = formHookContexts;
export const { useFieldContext, useFormContext } = formHookContexts;

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
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