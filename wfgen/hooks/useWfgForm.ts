import { createFormHook, useForm, type AnyFieldApi } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { postWithFormData } from "@wfgen/utils";
import { fieldContext, formContext } from "@wfgen/hooks/formContext";
import type { DataRow, WfgFormData } from "@wfgen/types";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import TextField from "@wfgen/components/FormFields/TextField";
import RadioGroup from "@wfgen/components/FormFields/RadioGroup";
import Checkbox from "@wfgen/components/FormFields/Checkbox";
import Comments from "@wfgen/components/Comments";
import DatePicker from "@wfgen/components/FormFields/DatePicker";
import ComplexTagPicker from "@wfgen/components/FormFields/ComplexTagPicker";
import Combobox from "@wfgen/components/FormFields/Combobox";
import Dropdown from "@wfgen/components/FormFields/Dropdown";
import NumberField from "@wfgen/components/FormFields/NumberField";
import FileField from "@wfgen/components/FormFields/FileField";
import Approvals from "@wfgen/components/Approvals";
import NewCommentForm from "@wfgen/components/Comments/NewCommentForm";
import DataGrid from "@wfgen/components/FormFields/DataGrid";
import Textarea from "@wfgen/components/FormFields/Textarea";
import type { ActionProps } from "@wfgen/components/FormFields/DataGrid/types";

const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        Textarea,
        RadioGroup,
        Checkbox,
        NumberField,
        Dropdown,
        Combobox,
        DatePicker,
        ComplexTagPicker,
        FileField,
        Comments,
        NewCommentForm,
        Approvals,
        DataGrid
    },
    formComponents: {}
});

function useWfgForm() {
    const { wfgFormData } = useFormInitQuery();

    const { mutateAsync } = useMutation({
        mutationFn: async (value: WfgFormData) => {
            value.Table1[0].FORM_ACTION = 'ASYNC_SUBMIT';
            const res = await postWithFormData({ formData: value });
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

export function useWfgDataRowForm(field: AnyFieldApi, onAction: (props: ActionProps) => void, defaultItem: DataRow) {
    return useAppForm({
        defaultValues: { ...defaultItem },
        onSubmitMeta: { close: false, index: -1 },
        onSubmit: ({ meta: { close, index }, value }) => {
            if (index < 0) {
                const newIndex = Math.abs(index + 1);
                const item = { ...value };
                field.insertValue(newIndex, { ...value });
                if (close) {
                    onAction({ type: 'close' });
                    return;
                }
                onAction({ type: 'edit', index: newIndex, item });
                return;
            }
            field.replaceValue(index, { ...value });
            if (close) {
                onAction({ type: 'close' });
            }
        }
    });
}

export type WfgForm = ReturnType<typeof useWfgForm>;
export type WfgPrintForm = ReturnType<typeof useWfgPrintForm>;
export type WfgValidationForm = ReturnType<typeof useWfgValidationForm>;
export type DataRowForm = ReturnType<typeof useWfgDataRowForm>;