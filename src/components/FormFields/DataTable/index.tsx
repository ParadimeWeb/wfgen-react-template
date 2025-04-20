import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, useTableColumnSizing_unstable, useTableFeatures, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps, type TableColumnDefinition, type TableColumnSizingOptions, type TableRowData } from "@fluentui/react-components";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";
import { useForm } from "@tanstack/react-form";
import type { ComponentType } from "react";
import { DataTableDrawer } from "./Drawer";
import { CellActions, NoRowsCellActions } from "./CellActions";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";

type RowProps = {
    item: DataRow
    index: number
    rows: TableRowData<DataRow>[]
    columnSizing_unstable: ReturnType<typeof useTableFeatures<DataRow>>['columnSizing_unstable']
    CellActionsComponent: ComponentType
};
type DataTableProps = {
    columnsDef: TableColumnDefinition<DataRow>[]
    columnSizingOptions: TableColumnSizingOptions
    TableCellComponent: ComponentType<RowProps>
    DrawerBodyComponent: ComponentType<DrawerBodyProps & { index: number }>
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps & { index: number }>
    drawerProps?: OverlayDrawerProps
    defaultItem?: DataRow
};

function View(props: DataTableProps) {
    const { columnsDef, columnSizingOptions, TableCellComponent, DrawerBodyComponent, DrawerHeaderTitle, drawerProps = {}, defaultItem = {} } = props;
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const field = useFieldContext<DataRow[]>();
    const tableForm = useForm({
        defaultValues: {
            isDrawerOpen: false,
            selectedIndex: -1,
            columns: columnsDef
        }
    });
    const { columns } = tableForm.state.values;
    const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
        {
            columns,
            items: field.state.value
        },
        [
            useTableColumnSizing_unstable({ columnSizingOptions, autoFitColumns: false })
        ]
    );
    const rows = getRows();

    return (<>
        <Table ref={tableRef} {...columnSizing_unstable.getTableProps()} noNativeElements>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (<TableHeaderCell key={column.columnId} {...columnSizing_unstable.getTableHeaderCellProps(column.columnId)}>{column.renderHeaderCell()}</TableHeaderCell>))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {!isPrintView && !isArchive && rows.length === 0 ? (
                    <TableRow>
                        <TableCell rowSpan={columns.length}>
                            <NoRowsCellActions
                                onClick={() => {
                                    tableForm.setFieldValue('isDrawerOpen', true);
                                    tableForm.setFieldValue('selectedIndex', 0);
                                    field.pushValue({...defaultItem});
                                }}
                            />
                        </TableCell>
                    </TableRow>
                ) : null}
                {rows.map(({ item }, index, rows) => (
                    <tableForm.Subscribe 
                        key={`datatablerow-${index}`} 
                        selector={s => s.values.selectedIndex}
                        children={(selectedIndex) => {
                            return (
                                <TableRow appearance={selectedIndex === index ? 'brand' : 'none'}>
                                    <TableCellComponent 
                                        index={index} 
                                        item={item} 
                                        rows={rows} 
                                        columnSizing_unstable={columnSizing_unstable} 
                                        CellActionsComponent={() => isPrintView ? null : (
                                            <CellActions
                                                onClick={(type) => {
                                                    if (type === 'add') {
                                                        tableForm.setFieldValue('selectedIndex', index + 1);
                                                        field.insertValue(index + 1, {...defaultItem});
                                                        tableForm.setFieldValue('isDrawerOpen', true);
                                                        return;
                                                    }
                                                    if (type === 'edit') {
                                                        tableForm.setFieldValue('selectedIndex', index);
                                                        field.replaceValue(index, {...item});
                                                        tableForm.setFieldValue('isDrawerOpen', true);
                                                        return;
                                                    }
                                                    field.removeValue(index);
                                                    if (tableForm.getFieldValue('isDrawerOpen') && (rows.length - 1) === index) {
                                                        tableForm.setFieldValue('selectedIndex', index - 1);
                                                        tableForm.setFieldValue('isDrawerOpen', index > 0);
                                                    }
                                                }}
                                            />
                                        )} 
                                    />
                                </TableRow>
                            );
                        }}
                    />
                ))}
            </TableBody>
        </Table>
        <tableForm.Subscribe 
            selector={s => s.values.isDrawerOpen}
            children={(isDrawerOpen) => (
                <DataTableDrawer 
                    {...drawerProps} 
                    open={isDrawerOpen} 
                    onOpenChange={(_, data) => { tableForm.setFieldValue('isDrawerOpen', data.open); }}
                    onAction={(type) => { 
                        if (type === 'add') {
                            const index = tableForm.getFieldValue('selectedIndex');
                            tableForm.setFieldValue('selectedIndex', index + 1);
                            field.insertValue(index + 1, {...defaultItem});
                            return;
                        }
                        if (type === 'remove') {
                            const index = tableForm.getFieldValue('selectedIndex');
                            field.removeValue(index);
                            if ((rows.length - 1) === index) {
                                tableForm.setFieldValue('selectedIndex', index - 1);
                                tableForm.setFieldValue('isDrawerOpen', index > 0);
                                return;
                            }
                            return;
                        }
                        tableForm.setFieldValue('isDrawerOpen', false); 
                        tableForm.resetField('selectedIndex'); 
                    }}
                    DrawerHeaderTitle={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <DrawerHeaderTitle index={selectedIndex} />} />}
                    DrawerBody={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <DrawerBodyComponent index={selectedIndex} />} />}
                />
            )}
        />
    </>);
}
export default (props: DataTableProps) => {
    return <View {...props} />;
}