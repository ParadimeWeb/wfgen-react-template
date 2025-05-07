import type { DialogProps, OverlayDrawerProps, TableColumnDefinition, TableColumnSizingOptions, TableRowData, useTableFeatures } from "@fluentui/react-components";
import type { DataRow } from "../../../types";
import type { ComponentType } from "react";
import type { DataRowForm } from "../../../hooks/useWfgForm";

export type RowProps = {
    item: DataRow
    index: number
    rows: TableRowData<DataRow>[]
    columnSizing_unstable: ReturnType<typeof useTableFeatures<DataRow>>['columnSizing_unstable']
    CellActionsComponent: ComponentType
};
export type _DataTableProps = {
    columnsDef: TableColumnDefinition<DataRow>[]
    columnSizingOptions: TableColumnSizingOptions
    TableCellComponent: ComponentType<RowProps>
    detailsFormType: 'drawer' | 'dialog' | 'inline'
    detailsFormProps?: OverlayDrawerProps | DialogProps
    DetailsBodyComponent?: ComponentType<{ index: number, form: DataRowForm }>
    DetailsTitleComponent?: ComponentType<{ index: number }>
    defaultItem?: DataRow
};
export type DataTableProps = 
    | {
        detailsFormType: 'drawer'
        detailsFormProps?: OverlayDrawerProps
        DetailsBodyComponent: ComponentType<{ index: number, form: DataRowForm }>
        DetailsTitleComponent: ComponentType<{ index: number }>
    } & _DataTableProps
    | {
        detailsFormType: 'dialog'
        detailsFormProps?: DialogProps
        DetailsBodyComponent: ComponentType<{ index: number, form: DataRowForm }>
        DetailsTitleComponent: ComponentType<{ index: number }>
    } & _DataTableProps
    | {
        detailsFormType: 'inline'
    } & _DataTableProps;