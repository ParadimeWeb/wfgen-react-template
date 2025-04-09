import type { FieldProps, TagPickerProps, TagProps } from "@fluentui/react-components";
import type { DataRow, QueryResult } from "../../../types";
import type { ComponentType } from "react";
import type { InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

type QueryOptions = ReturnType<typeof infiniteQueryOptions<QueryResult, Error, InfiniteData<QueryResult>, string[], number>>;

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
    queryOptions: (query: string) => QueryOptions
    localQuery?: boolean
    limit?: number
    TagComponent?: ComponentType<Omit<RowTagProps, 'rows'>>
    TagPickerGroupComponent?: ComponentType<Pick<RowTagProps, 'rows'>>
    TagPickerOptionComponent?: ComponentType<Pick<RowTagProps, 'row' | 'rows'>>
};

export type ComplexTagPickerListProps = {
    queryOptions: (query: string) => QueryOptions
    localQuery?: boolean
    rows: DataRow[]
	query: string
	selectedOptions: string[]
    TagPickerOptionComponent?: ComponentType<Pick<RowTagProps, 'row' | 'rows'>>
    filterRows?: (rows: DataRow[], query: string) => DataRow[]
};