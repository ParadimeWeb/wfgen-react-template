import type { AvatarProps } from "@fluentui/react-components";
import type { MutationFunction } from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ActionResult, Directory, Table1, WfgFormData } from "@wfgen/types";
import axios from "axios";
import type { WfgForm } from "@wfgen/hooks/useWfgForm";

function createFormHiddenInput(id: string, value: string, form?: HTMLFormElement) {
    const input = document.createElement('input');
    input.id = id;
    input.name = id;
    input.type = 'hidden';
    input.value = value;
    if (form) {
        form.append(input);
    }
    return input;
}

const viewState = document.getElementById('__VIEWSTATE') as HTMLInputElement | null ?? createFormHiddenInput('__VIEWSTATE', '__VIEWSTATE');
const form = document.forms.length > 0 ? document.forms[0] : null;
const axiosInstance = axios.create({
    baseURL: form?.action,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

function validateASPXWebForm() {
    if (!form) {
        throw new Error('Missing form element. ASP.NET webform needs a runat server form.');
    }
}

export const directoryColors = new Map<Directory, AvatarProps["color"]>([
    ["WORKFLOWGEN", "dark-red"],
    ["CENTRIC_BRANDS", "brand"],
    ["CUSTOMERS", "dark-green"]
]);

export function post<T>(action: string, { url, data, config, withViewState = true }: { url?: string, data?: FormData, config?: AxiosRequestConfig<FormData>, withViewState?: boolean } = {}) {
    validateASPXWebForm();
    const formData = data ?? new FormData();
    if (withViewState) {
        formData.set('__VIEWSTATE', viewState.value);
    }
    formData.set('__WFGENACTION', action);
    return axiosInstance.post<T>(url ?? '', formData, config);
}
export const postWithFormData: MutationFunction<AxiosResponse<ActionResult, any>, { formData: WfgFormData, config?: AxiosRequestConfig<FormData> }> = ({ formData, config }) => {
    const data = new FormData();
    data.set('FormData', new Blob([JSON.stringify(formData)], { type: 'application/json' }), 'FormDataJson');
    return post<ActionResult>(formData.Table1[0].FORM_ACTION ?? 'ASYNC_SAVE', { data, config });
}
export const downloadFile = (field: string, filePath: string, dispositionType: 'inline' | 'attachment' = 'inline') => {
    if (!form) return;
    const wfgenAction = document.getElementById('__WFGENACTION') as HTMLInputElement | null ?? createFormHiddenInput('__WFGENACTION', 'POST_DOWNLOAD', form);
    wfgenAction.value = 'POST_DOWNLOAD';

    const filePathInput = document.getElementById('FILE_PATH') as HTMLInputElement | null ?? createFormHiddenInput('FILE_PATH', filePath, form);
    filePathInput.value = filePath;

    const fileDispositionTypeInput = document.getElementById('FILE_DISPOSITION_TYPE') as HTMLInputElement | null ?? createFormHiddenInput('FILE_DISPOSITION_TYPE', dispositionType, form);
    fileDispositionTypeInput.value = dispositionType;

    form.target = `_${field}`;
    form.submit();
}

export function csvToSet(value: string | null) {
    return new Set(value?.split(',').filter(o=>o));
}
export function setToCsv(value: Set<string>) {
    return [...value].join(',');
}
export function makeReadonly(form: WfgForm, field: string, condition: boolean) {
    form.setFieldValue('Table1[0].FORM_FIELDS_READONLY', v => {
        const FORM_FIELDS_READONLY = v as Table1['FORM_FIELDS_READONLY'];
        const set = csvToSet(FORM_FIELDS_READONLY ?? '');
        if (condition) {
            set.add(field);
        }
        else {
            set.delete(field);
        }
        return setToCsv(set);
    });
}
export function makeRequired(form: WfgForm, field: string, condition: boolean) {
    form.setFieldValue('Table1[0].FORM_FIELDS_REQUIRED', v => {
        const FORM_FIELDS_REQUIRED = v as Table1['FORM_FIELDS_REQUIRED'];
        const set = csvToSet(FORM_FIELDS_REQUIRED ?? '');
        if (condition) {
            set.add(field);
        }
        else {
            set.delete(field);
        }
        return setToCsv(set);
    });
}

export class NumberParser {
    private _group: RegExp;
    private _decimal: RegExp;
    private _numeral: RegExp;
    private _index: (d: string, ...args: any[]) => string;
    constructor(locale: string) {
        const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
        const numerals = [...new Intl.NumberFormat(locale, {useGrouping: false}).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [d, i.toString()]));
        this._group = new RegExp(`[${parts.find(d => d.type === "group")!.value}]`, "g");
        this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal")!.value}]`);
        this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
        this._index = d => index.get(d)!;
    }
    parse(string: string) {
        const parsed = string.trim()
            .replace(this._group, "")
            .replace(this._decimal, ".")
            .replace(this._numeral, this._index);
        
        const n = +parsed;
        if (parsed.endsWith('.') || isNaN(n)) {
            throw new Error(`Could not parse ${string} into a number.`);
        }
        return n;
    }
    tryParse(string: string) {
        try {
            return this.parse(string);
        }
        catch {
            return undefined;
        }
    }
}