import { DialogContent, DialogTitle, DrawerBody, DrawerHeaderTitle, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, useTableColumnSizing_unstable, useTableFeatures, type DialogProps, type OverlayDrawerProps, type TableColumnDefinition, type TableColumnSizingOptions, type TableRowData } from "@fluentui/react-components";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";
import type { ComponentType } from "react";
import { DataTableDrawer } from "../../Drawers/DataTable";
import { CellActions, NoRowsCellActions } from "./CellActions";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { DataTableDialog } from "../../Dialogs/DataTable";
import { useAppForm } from "../../../hooks/useWfgForm";
import { useForm } from "@tanstack/react-form";
import { ValidationErrorsMessageBar } from "./ValidationErrorsMessageBar";

type RowProps = {
    item: DataRow
    index: number
    rows: TableRowData<DataRow>[]
    columnSizing_unstable: ReturnType<typeof useTableFeatures<DataRow>>['columnSizing_unstable']
    CellActionsComponent: ComponentType
};
function useWfgDataRowForm(defaultValues: DataRow) {
    return useAppForm({
        defaultValues,
        onSubmitMeta: { close: false }
    });
}
export type Action = 'add_form' | 'add_cell' | 'remove_form' | 'remove_cell' | 'edit' | 'open' | 'close' | 'next' | 'prev';
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
    const { isArchive } = useFormInitQuery();
    const field = useFieldContext<DataRow[]>();
    const dtForm = useForm({
        defaultValues: {
            isDetailsFormOpen: false,
            selectedIndex: -1,
            columns: columnsDef
        }
    });
    const { columns } = dtForm.state.values;
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
    function createWfgDataRowForm(index: number) {
        return useAppForm({
            defaultValues: { ...rows[index].item },
            onSubmitMeta: { close: false },
            onSubmit: ({ meta, value }) => {
                field.replaceValue(index, { ...value });
                if (meta.close) {
                    onAction('close');
                }
            }
        });
    }
    const actionMap = new Map<Action, (index?: number, item?: DataRow) => void>([
        ['add_form', () => {
            dtForm.setFieldValue('selectedIndex', (value) => {
                const index = value + 1;
                field.insertValue(index + 1, { ...defaultItem });
                return index;
            });
        }],
        ['add_cell', () => {
            onAction('add_form');
            onAction('open');
        }],
        ['remove_form', (index) => {
            field.removeValue(index!);
            if (rows.length === 1) {
                onAction('close');
                return;
            }
            if ((rows.length - 1) === index) {
                dtForm.setFieldValue('selectedIndex', rows.length - 2);
            }
        }],
        ['remove_cell', (index) => {
            if (dtForm.getFieldValue('isDetailsFormOpen')) {
                onAction('remove_form', index);
                return;
            }
            field.removeValue(index!);
        }],
        ['edit', (index, item) => {
            dtForm.setFieldValue('selectedIndex', index!);
            field.replaceValue(index!, {...item});
            onAction('open', index);
        }],
        ['close', () => {
            dtForm.setFieldValue('isDetailsFormOpen', false);
            dtForm.resetField('selectedIndex');
        }],
        ['open', () => {
            dtForm.setFieldValue('isDetailsFormOpen', true);
        }],
        ['prev', () => {
            dtForm.setFieldValue('selectedIndex', (value) => {
                const prev = value - 1;
                field.replaceValue(prev, {...rows[prev].item});
                return prev;
            });
        }],
        ['next', () => {
            dtForm.setFieldValue('selectedIndex', (value) => {
                const next = value + 1;
                field.replaceValue(next, {...rows[next].item});
                return next;
            });
        }]
    ]);
    const onAction = (type: Action, index?: number, item?: DataRow) => {
        console.log('onAction', type, index, item);
         actionMap.get(type)?.call(null, index, item);
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
                                onClick={(type) => {
                                    onAction(type, 0);
                                }}
                            />
                        </TableCell>
                    </TableRow>
                ) : null}
                {rows.map(({ item }, index, rows) => (
                    <dtForm.Subscribe 
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
                                                    onAction(type, index, item);
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
        <dtForm.Subscribe 
            selector={s => s.values.isDetailsFormOpen}
            children={(isDetailsFormOpen) => {
                if (detailsFormType === 'dialog') {
                    return (
                        <DataTableDialog 
                            {...detailsFormProps as DialogProps}
                            open={isDetailsFormOpen}
                            onOpenChange={(_, data) => {
                                onAction(data.open ? 'open' : 'close');
                            }}
                            onAction={onAction}
                            DialogForm={(props) => {
                                const { children: Child } = props;
                                return (
                                    <dtForm.Subscribe 
                                        selector={s => s.values.selectedIndex}
                                        children={(selectedIndex) => {
                                            if (selectedIndex < 0) return null;
                                            const drForm = createWfgDataRowForm(selectedIndex);
                                            return (
                                                <Child form={drForm} index={selectedIndex} count={rows.length} />
                                            );
                                        }}
                                    />
                                );
                            }}
                            DialogTitle={(props) => {
                                const { form, index } = props;
                                return (
                                    <DialogTitle>
                                        <DetailsTitleComponent index={index} />
                                        <ValidationErrorsMessageBar form={form} />
                                    </DialogTitle>
                                );
                            }}
                            DialogContent={(props) => {
                                const { form, index } = props;
                                return (
                                    <DialogContent>
                                        <DetailsBodyComponent index={index} form={form} />
                                    </DialogContent>
                                );
                            }}
                        />
                    );
                }
                return (
                    <DataTableDrawer 
                        {...detailsFormProps as OverlayDrawerProps}
                        open={isDetailsFormOpen}
                        onOpenChange={(_, data) => {
                            onAction(data.open ? 'open' : 'close');
                        }}
                        onAction={onAction}
                        DrawerForm={(props) => {
                            const { children: Child } = props;
                            return (
                                <dtForm.Subscribe 
                                    selector={s => s.values.selectedIndex}
                                    children={(selectedIndex) => {
                                        if (selectedIndex < 0) return null;
                                        const drForm = createWfgDataRowForm(selectedIndex);
                                        return (
                                            <Child form={drForm} index={selectedIndex} count={rows.length} />
                                        );
                                    }}
                                />
                            );
                        }}
                        DrawerHeaderTitle={(props) => {
                            const { form, index } = props;
                            return (
                                <DrawerHeaderTitle>
                                    <DetailsTitleComponent index={index} />
                                    <ValidationErrorsMessageBar form={form} />
                                </DrawerHeaderTitle>
                            );
                        }}
                        DrawerBody={(props) => {
                            const { form, index } = props;
                            return (
                                <DrawerBody>
                                    <DetailsBodyComponent form={form} index={index} />
                                </DrawerBody>
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