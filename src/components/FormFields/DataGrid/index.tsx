import { DialogContent, DialogTitle, DrawerBody, DrawerHeaderTitle, Field, Table, TableBody, TableHeader, TableHeaderCell, TableRow, useTableColumnSizing_unstable, useTableFeatures, type DialogProps, type OverlayDrawerProps } from "@fluentui/react-components";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow, RowAction } from "../../../types";
import { DataGridDrawer } from "../../Drawers/DataGrid";
import { CellActions, NoRowsCellActions } from "./CellActions";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { DataGridDialog } from "../../Dialogs/DataGrid";
import { useForm } from "@tanstack/react-form";
import { ValidationErrorsMessageBar } from "./ValidationErrorsMessageBar";
import type { DataTableProps } from "./types";
import { useWfgDataRowForm } from "../../../hooks/useWfgForm";
import { useTranslation } from "react-i18next";

function View(props: DataTableProps) {
    const { columnsDef, columnSizingOptions, detailsFormType, TableCellComponent, DetailsBodyComponent, DetailsTitleComponent, detailsFormProps = {}, defaultItem = {} } = props;
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { t } = useTranslation();
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
    
    const actionMap = new Map<RowAction, (index?: number, item?: DataRow) => void>([
        ['add_form', (index) => {
            dtForm.setFieldValue('selectedIndex', (value) => {
                const insertIndex = (index === undefined ? value : index) + 1;
                field.insertValue(insertIndex, { ...defaultItem });
                return insertIndex;
            });
        }],
        ['add_cell', (index) => {
            onAction('add_form', index);
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
    const onAction = (type: RowAction, index?: number, item?: DataRow) => {
        actionMap.get(type)?.call(null, index, item);
    }

    return (<>
        <Field
            validationState={field.state.meta.errors.length > 0 ? "error" : "warning"}
            validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : rows.length === 0 ? t('The table is empty') : null}
        >
            <Table ref={tableRef} {...columnSizing_unstable.getTableProps()} noNativeElements>
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHeaderCell key={column.columnId} {...columnSizing_unstable.getTableHeaderCellProps(column.columnId)}>
                                {column.renderHeaderCell()}
                                {index > 0 ? null :
                                <NoRowsCellActions 
                                    onClick={(type) => {
                                        onAction(type, -1);
                                    }}
                                />}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(({ item }, index, rows) => (
                        <dtForm.Subscribe 
                            key={`datatablerow-${index}`} 
                            selector={s => s.values.selectedIndex}
                            children={(selectedIndex) => {
                                return (
                                    <TableRow appearance={detailsFormType !== 'inline' && selectedIndex === index ? 'brand' : 'none'}>
                                        <TableCellComponent 
                                            index={index} 
                                            item={item} 
                                            rows={rows} 
                                            columnSizing_unstable={columnSizing_unstable} 
                                            CellActionsComponent={() => isPrintView ? null : (
                                                <CellActions
                                                    commands={new Set(detailsFormType !== 'inline' ? ['add', 'delete', 'edit'] : ['add', 'delete'])}
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
        </Field>
        {detailsFormType !== 'inline' ?
        <dtForm.Subscribe 
            selector={s => s.values.isDetailsFormOpen}
            children={(isDetailsFormOpen) => {
                if (detailsFormType === 'dialog') {
                    return (
                        <DataGridDialog 
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
                                            const drForm = useWfgDataRowForm(field, rows, onAction, selectedIndex);
                                            return (
                                                <Child form={drForm} index={selectedIndex} count={rows.length} />
                                            );
                                        }}
                                    />
                                );
                            }}
                            DialogTitle={(props) => {
                                const { form, index, ...dialogTitleProps } = props;
                                return (
                                    <DialogTitle {...dialogTitleProps}>
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
                    <DataGridDrawer 
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
                                        const drForm = useWfgDataRowForm(field, rows, onAction, selectedIndex);
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
                            const { form, index, ...drawerBodyProps } = props;
                            return (
                                <DrawerBody {...drawerBodyProps}>
                                    <DetailsBodyComponent form={form} index={index} />
                                </DrawerBody>
                            );
                        }}
                    />
                );
            }}
        /> : null}
    </>);
}
export default (props: DataTableProps) => {
    return <View {...props} />;
}