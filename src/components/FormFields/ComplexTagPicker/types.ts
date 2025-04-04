import type { FieldProps, TagPickerProps, TagProps } from "@fluentui/react-components";
import type { DataRow } from "../../../types";
import type { QueryOptionsWithQuery } from "../../../queryOptions";
import type { ComponentType } from "react";

export type RowTagProps = {
    row: DataRow
    rows: DataRow[]
    fieldProps?: FieldProps
    tagProps?: TagProps
};

export type ComplexTagPickerProps = {
    fieldProps?: FieldProps
    tagPickerProps?: TagPickerProps
    printFieldProps?: FieldProps
    printTagProps?: TagProps
    readonlyFieldProps?: FieldProps
    readonlyTagProps?: TagProps
    queryOptions: QueryOptionsWithQuery
    pageSize?: number
    localQuery?: boolean
    limit?: number
    TagComponent?: ComponentType<Omit<RowTagProps, 'rows'>>
    TagPickerGroupComponent?: ComponentType<Pick<RowTagProps, 'rows'>>
    TagPickerOptionComponent?: ComponentType<Pick<RowTagProps, 'row' | 'rows'>>
};

export type ComplexTagPickerListProps = {
    queryOptions: QueryOptionsWithQuery
    pageSize?: number
    localQuery?: boolean
    rows: DataRow[]
	query: string
	selectedOptions: string[]
    TagPickerOptionComponent?: ComponentType<Pick<RowTagProps, 'row' | 'rows'>>
    filterRows?: (rows: DataRow[], query: string) => DataRow[]
};