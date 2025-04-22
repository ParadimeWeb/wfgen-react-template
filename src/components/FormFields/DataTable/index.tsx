import { Button, DialogContent, DialogTitle, DrawerBody, DrawerHeaderTitle, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, ToolbarButton, useTableColumnSizing_unstable, useTableFeatures, type DialogProps, type OverlayDrawerProps, type TableColumnDefinition, type TableColumnSizingOptions, type TableRowData } from "@fluentui/react-components";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";
import type { ComponentType } from "react";
import { DataTableDrawer } from "../../Drawers/DataTable";
import { CellActions, NoRowsCellActions } from "./CellActions";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { DataTableDialog } from "../../Dialogs/DataTable";
import { NextRegular, PreviousRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useAppForm } from "../../../hooks/useWfgForm";
import { useForm } from "@tanstack/react-form";

type RowProps = {
    item: DataRow
    index: number
    rows: TableRowData<DataRow>[]
    columnSizing_unstable: ReturnType<typeof useTableFeatures<DataRow>>['columnSizing_unstable']
    CellActionsComponent: ComponentType
};
function useWfgDataRowForm(defaultValues: { index: number, row: DataRow }) {
    return useAppForm({
        defaultValues
    });
}
export type DataRowForm = ReturnType<typeof useWfgDataRowForm>;
type _DataTableProps = {
    columnsDef: TableColumnDefinition<DataRow>[]
    columnSizingOptions: TableColumnSizingOptions
    TableCellComponent: ComponentType<RowProps>
    DetailsBodyComponent: ComponentType<{ index: number, form: DataRowForm }>
    DetailsTitleComponent: ComponentType<{ index: number }>
    defaultItem?: DataRow
};
type DataTableProps = 
    | {
        detailsFormType: 'drawer'
        detailsFormProps?: OverlayDrawerProps
        
    } & _DataTableProps
    | {
        detailsFormType: 'dialog'
        detailsFormProps?: DialogProps
    } & _DataTableProps;

function View(props: DataTableProps) {
    const { columnsDef, columnSizingOptions, detailsFormType, TableCellComponent, DetailsBodyComponent, DetailsTitleComponent, detailsFormProps = {}, defaultItem = {} } = props;
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    const field = useFieldContext<DataRow[]>();
    const tableForm = useForm({
        defaultValues: {
            isDetailsFormOpen: false,
            selectedIndex: -1,
            columns: columnsDef
        }
    });
    function createWfgDataRowForm(defaultValues: { index: number, row: DataRow }) {
        return useAppForm({
            defaultValues,
            onSubmit: ({ value: { index, row } }) => {
                console.log('onSubmit', row);
                field.replaceValue(index, {...row});
                tableForm.setFieldValue('isDetailsFormOpen', false); 
                tableForm.resetField('selectedIndex');
            }
        });
    }
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
    function onAction(type: 'add' | 'remove' | 'close') {
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
                tableForm.setFieldValue('isDetailsFormOpen', index > 0);
                return;
            }
            return;
        }
        tableForm.handleSubmit();
        // tableForm.setFieldValue('isDetailsFormOpen', false); 
        // tableForm.resetField('selectedIndex');
    }
    function onNextPrev(index: number) {
        tableForm.setFieldValue('selectedIndex', index); 
        field.replaceValue(index, {...rows[index].item});
    }

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
                                    tableForm.setFieldValue('isDetailsFormOpen', true);
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
                                                        tableForm.setFieldValue('isDetailsFormOpen', true);
                                                        return;
                                                    }
                                                    if (type === 'edit') {
                                                        tableForm.setFieldValue('selectedIndex', index);
                                                        field.replaceValue(index, {...item});
                                                        tableForm.setFieldValue('isDetailsFormOpen', true);
                                                        return;
                                                    }
                                                    field.removeValue(index);
                                                    if (tableForm.getFieldValue('isDetailsFormOpen') && (rows.length - 1) === index) {
                                                        tableForm.setFieldValue('selectedIndex', index - 1);
                                                        tableForm.setFieldValue('isDetailsFormOpen', index > 0);
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
            selector={s => s.values.isDetailsFormOpen}
            children={(isDetailsFormOpen) => {
                if (detailsFormType === 'dialog') {
                    return (
                        <DataTableDialog 
                            {...detailsFormProps as DialogProps}
                            open={isDetailsFormOpen}
                            onOpenChange={(_, data) => { tableForm.setFieldValue('isDetailsFormOpen', data.open); if (!data.open) { tableForm.resetField('selectedIndex'); } }}
                            onAction={onAction}
                            NextButton={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <Button aria-label={t('Next')} icon={<NextRegular />} disabled={rows.length === selectedIndex + 1} onClick={() => { onNextPrev(selectedIndex + 1); }} />} />}
                            PrevButton={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <Button aria-label={t('Prev')} icon={<PreviousRegular />} disabled={selectedIndex < 1} onClick={() => { onNextPrev(selectedIndex - 1); }} />} />}
                            DialogTitle={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <DialogTitle><DetailsTitleComponent index={selectedIndex} /></DialogTitle>} />}
                            DialogContent={() => {
                                return (
                                    <tableForm.Subscribe 
                                        selector={s => s.values.selectedIndex} 
                                        children={(selectedIndex) => {
                                            const rowForm = useWfgDataRowForm({
                                                index: selectedIndex,
                                                row: { ...rows[selectedIndex].item }
                                            });
                                            return (
                                                <DialogContent><DetailsBodyComponent index={selectedIndex} form={rowForm} /></DialogContent>
                                            );
                                        }}
                                    />
                                );
                            }}
                        />
                    );
                }
                return (
                    <DataTableDrawer 
                        {...detailsFormProps as OverlayDrawerProps} 
                        open={isDetailsFormOpen} 
                        onOpenChange={(_, data) => { tableForm.setFieldValue('isDetailsFormOpen', data.open); if (!data.open) { tableForm.resetField('selectedIndex'); } }}
                        onAction={onAction}
                        DrawerForm={({ children: Child }) => {
                            return (
                                <tableForm.Subscribe 
                                    selector={s => s.values.selectedIndex} 
                                    children={(selectedIndex) => {
                                        if (selectedIndex < 0) return null;
                                        console.log('DrawerForm', selectedIndex);
                                        const rowForm = createWfgDataRowForm({
                                            index: selectedIndex,
                                            row: { ...rows[selectedIndex].item }
                                        });
                                        return <Child form={rowForm} index={selectedIndex} />
                                    }} 
                                />
                            );
                        }}
                        NextButton={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <ToolbarButton aria-label={t('Next')} icon={<NextRegular />} disabled={rows.length === selectedIndex + 1} onClick={() => { onNextPrev(selectedIndex + 1); }} />} />}
                        PrevButton={() => <tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <ToolbarButton aria-label={t('Prev')} icon={<PreviousRegular />} disabled={selectedIndex < 1} onClick={() => { onNextPrev(selectedIndex - 1); }} />} />}
                        DrawerHeaderTitle={({ form, index }) => {
                            return (
                                <DrawerHeaderTitle>
                                    <DetailsTitleComponent index={index} />
                                    
                                </DrawerHeaderTitle>
                            );
                        }}
                        DrawerBody={({ form, index }) => {
                            return (
                                <DrawerBody><DetailsBodyComponent form={form} index={index} /></DrawerBody>
                            );
                        }}
                    />
                );
            }}
        />
    </>);
}
export default (props: DataTableProps) => {
    return <View {...props} />;
}