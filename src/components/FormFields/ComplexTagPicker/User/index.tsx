import type { DataRow, User } from "../../../../types";

export function filterUserRows(rows: DataRow[], query: string) {
    return query === '' ? rows : rows.filter(r => {
        const { CommonName } = r as User;
        return CommonName!.toLowerCase().includes(query.toLowerCase());
    });
}
