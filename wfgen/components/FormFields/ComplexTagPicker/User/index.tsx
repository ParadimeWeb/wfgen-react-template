import type { User } from "@wfgen/types";
import type { FilterRowsProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";

export function filterUserRows({ rows, query }: FilterRowsProps) {
    return query === '' ? rows : rows.filter(r => {
        const { CommonName } = r as User;
        return CommonName!.toLowerCase().includes(query.toLowerCase());
    });
}
