import type { AvatarProps } from "@fluentui/react-components";

export const directoryColors = new Map<string, AvatarProps["color"]>([
    ["WORKFLOWGEN", "red"],
    ["CENTRIC_BRANDS", "blue"]
]);

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