import type { FieldProps, TagPickerProps, TagProps } from "@fluentui/react-components";
import type { DataRow, QueryResult } from "@wfgen/types";
import type { ComponentType } from "react";
import type { InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";

type QueryOptions = ReturnType<typeof infiniteQueryOptions<QueryResult, Error, InfiniteData<QueryResult>, string[], number>>;

export type RowTagProps = {
    row: DataRow
    rows: DataRow[]
    fieldProps?: FieldProps
    tagProps?: TagProps
    valueKey: string
    textKey: string
};

export type TagComponentProps = Omit<RowTagProps, 'rows'>;
export type TagPickerGroupComponentProps = Pick<RowTagProps, 'rows' | 'textKey' | 'valueKey'>;
export type TagPickerOptionComponentProps = Pick<RowTagProps, 'row' | 'rows' | 'textKey' | 'valueKey'>;
export type FilterRowsProps = Pick<RowTagProps, 'rows' | 'textKey' | 'valueKey'> & { query: string };
export type ComplexTagPickerProps = {
    fieldProps?: FieldProps
    tagPickerProps?: Partial<TagPickerProps>
    printFieldProps?: FieldProps
    printTagProps?: TagProps
    readonlyFieldProps?: FieldProps
    readonlyTagProps?: TagProps
    queryOptions: (query: string) => QueryOptions
    localQuery?: boolean
    limit?: number
    TagComponent?: ComponentType<TagComponentProps>
    TagPickerGroupComponent?: ComponentType<TagPickerGroupComponentProps>
    TagPickerOptionComponent?: ComponentType<TagPickerOptionComponentProps>
    filterRows?: (props: FilterRowsProps) => DataRow[]
    valueKey?: string
    textKey?: string
    asyncDebounceMs?: number
    readonly?: boolean
};

export type ComplexTagPickerListProps = {
    queryOptions: (query: string) => QueryOptions
    localQuery?: boolean
    rows: DataRow[]
	query: string
	selectedOptions: string[]
    TagPickerOptionComponent: ComponentType<TagPickerOptionComponentProps>
    filterRows: (props: FilterRowsProps) => DataRow[]
    valueKey: string
    textKey: string
};