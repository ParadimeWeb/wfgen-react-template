import type { DialogProps, OverlayDrawerProps } from "@fluentui/react-components";
import type { DataRow, RowAction } from "@wfgen/types";
import type { ComponentType } from "react";
import type { DataRowForm } from "@wfgen/hooks/useWfgForm";

export type ActionProps = { 
    type: RowAction
    drForm?: DataRowForm
    index?: number
    item?: DataRow 
};
export type RowProps = {
    item: DataRow
    index: number
    rows: DataRow[]
    readonly: boolean
};
export type _DataTableProps = {
    TableCellComponent: ComponentType<RowProps>
    TableHeaderCellComponent: ComponentType
    TableFooterCellComponent?: ComponentType<Pick<RowProps, 'rows'>>
    detailsFormType: 'drawer' | 'dialog' | 'inline'
    detailsFormProps?: OverlayDrawerProps | DialogProps
    DetailsBodyComponent?: ComponentType<{ index: number, form: DataRowForm, readonly: boolean, rows: RowProps['rows']}>
    DetailsTitleComponent?: ComponentType<{ index: number, readonly: boolean }>
    defaultItem?: DataRow
    readonly?: boolean
    onDetailsFormReset?: (data: { form?: DataRowForm, index?: number }) => void
};
export type DataTableProps = 
    | {
        detailsFormType: 'drawer'
        detailsFormProps?: OverlayDrawerProps
        DetailsBodyComponent: ComponentType<{ index: number, form: DataRowForm, readonly: boolean, rows: RowProps['rows'] }>
        DetailsTitleComponent: ComponentType<{ index: number, readonly: boolean }>
    } & _DataTableProps
    | {
        detailsFormType: 'dialog'
        detailsFormProps?: DialogProps
        DetailsBodyComponent: ComponentType<{ index: number, form: DataRowForm, readonly: boolean, rows: RowProps['rows'] }>
        DetailsTitleComponent: ComponentType<{ index: number, readonly: boolean }>
    } & _DataTableProps
    | {
        detailsFormType: 'inline'
    } & _DataTableProps;