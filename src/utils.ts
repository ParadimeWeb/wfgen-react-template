import type { AvatarProps } from "@fluentui/react-components";
import type { MutationFunction } from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ActionResult, WfgFormData } from "./types";
import axios from "axios";

const viewState = document.getElementById('__VIEWSTATE') as HTMLInputElement | null ?? createFakeViewState();
const form = document.forms.length > 0 ? document.forms[0] : null;
const axiosInstance = axios.create({
    baseURL: form?.action,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

function createFakeViewState() {
    const input = document.createElement('input');
    input.name = '__VIEWSTATE';
    input.type = 'hidden';
    input.value = '__VIEWSTATE';
    return input;
}

function validateASPXWebForm() {
    if (!form) {
        throw new Error('Missing form element. ASP.NET webform needs a runat server form.');
    }
}

export const directoryColors = new Map<string, AvatarProps["color"]>([
    ["WORKFLOWGEN", "red"],
    ["CENTRIC_BRANDS", "blue"]
]);

export function post<T>(action: string, { url, data, config, withViewState = true }: { url?: string, data?: FormData, config?: AxiosRequestConfig<FormData> | undefined, withViewState?: boolean } = {}) {
    validateASPXWebForm();
    const formData = data ?? new FormData();
    if (withViewState) {
        formData.set('__VIEWSTATE', viewState.value);
    }
    formData.set('__WFGENACTION', action);
    return axiosInstance.post<T>(url ?? '', formData, config);
}
export const asyncAction: MutationFunction<AxiosResponse<ActionResult, any>, WfgFormData> = (formData) => {
    const data = new FormData();
    data.set('FormData', new Blob([JSON.stringify(formData)], { type: 'application/json' }), 'FormDataJson');
    return post<ActionResult>(formData.Table1[0].FORM_ACTION ?? 'ASYNC_SAVE', { data });
}

export function csvToSet(value: string | null) {
    return new Set(value?.split(',').filter(o=>o));
}
export function setToCsv(value: Set<string>) {
    return [...value].join(',');
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