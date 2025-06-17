import { DialogContent, DialogTitle, DrawerBody, DrawerHeaderTitle, Field, Table, TableBody, TableHeader, TableRow, type DialogProps, type OverlayDrawerProps } from "@fluentui/react-components";
import { useFieldContext } from "@wfgen/hooks/formContext";
import type { DataRow, RowAction } from "@wfgen/types";
import { DataGridDrawer } from "@wfgen/components/Drawers/DataGrid";
import { TableCellActions, TableHeaderCellActions } from "./CellActions";
import { DataGridDialog } from "@wfgen/components/Dialogs/DataGrid";
import { useForm, useStore } from "@tanstack/react-form";
import { ValidationErrorsMessageBar } from "@wfgen/components/FormFields/DataGrid/ValidationErrorsMessageBar";
import type { ActionProps, DataTableProps } from "@wfgen/components/FormFields/DataGrid/types";
import { useWfgDataRowForm } from "@wfgen/hooks/useWfgForm";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { csvToSet } from "@wfgen/utils";

function View(props: DataTableProps) {
    const { detailsFormType, TableCellComponent, TableHeaderCellComponent, TableFooterCellComponent, DetailsBodyComponent, DetailsTitleComponent, detailsFormProps = {}, defaultItem = {}, readonly = false, onDetailsFormReset = () => {} } = props;
    const { t } = useTranslation();
    const field = useFieldContext<DataRow[]>();
    const dtForm = useForm({
        defaultValues: {
            isDetailsFormOpen: false,
            selectedIndex: -1
        }
    });
    const rows = field.state.value;
    
    return (
        <dtForm.Subscribe 
            selector={s => s.values.selectedIndex}
            children={(selectedIndex) => {
                const actionMap = new Map<RowAction, (actionProps: Omit<ActionProps, 'type'>) => void>([
                    ['add_form', ({ index }) => {
                        dtForm.setFieldValue('selectedIndex', (value) => {
                            const insertIndex = 0 - ((index === undefined ? value : index) + 2);
                            drForm?.reset({ ...defaultItem }, { keepDefaultValues: true });
                            onDetailsFormReset({ form: drForm, index: insertIndex });
                            return insertIndex;
                        });
                    }],
                    ['add_cell', (props) => {
                        onAction({ ...props, type: 'add_form' });
                        onAction({ ...props, type: 'open' });
                    }],
                    ['remove_form', (props) => {
                        const { index } = props;
                        field.removeValue(index!);
                        if (rows.length === 1) {
                            onAction({ ...props, type: 'close' });
                            return;
                        }
                        if ((rows.length - 1) === index) {
                            dtForm.setFieldValue('selectedIndex', rows.length - 2);
                        }
                    }],
                    ['remove_cell', (props) => {
                        if (dtForm.getFieldValue('isDetailsFormOpen')) {
                            onAction({ ...props, type: 'remove_form' });
                            return;
                        }
                        field.removeValue(props.index!);
                    }],
                    ['edit', (props) => {
                        const { index = 0, item } = props;
                        drForm?.reset({ ...item }, { keepDefaultValues: true });
                        onDetailsFormReset({ form: drForm, index });
                        dtForm.setFieldValue('selectedIndex', index);
                        field.replaceValue(index, { ...item });
                        onAction({ ...props, type: 'open' });
                    }],
                    ['close', () => {
                        dtForm.setFieldValue('isDetailsFormOpen', false);
                        dtForm.resetField('selectedIndex');
                    }],
                    ['open', () => {
                        dtForm.setFieldValue('isDetailsFormOpen', true);
                    }],
                    ['prev', ({ index = 0 }) => {
                        const prev = (index < 0 ? Math.abs(index + 1) : index) - 1;
                        drForm?.reset({ ...rows[prev] }, { keepDefaultValues: true });
                        onDetailsFormReset({ form: drForm, index: prev });
                        dtForm.setFieldValue('selectedIndex', prev);
                        field.replaceValue(prev, { ...rows[prev] });
                    }],
                    ['next', ({ index = 0 }) => {
                        const next = (index < 0 ? Math.abs(index + 1) : index) + 1;
                        drForm?.reset({ ...rows[next] }, { keepDefaultValues: true });
                        onDetailsFormReset({ form: drForm, index: next });
                        dtForm.setFieldValue('selectedIndex', next);
                        field.replaceValue(next, { ...rows[next] });
                    }]
                ]);
                const onAction = ({ type, ...actionProps }: ActionProps) => {
                    actionMap.get(type)?.call(null, actionProps);
                }
                const drForm = useWfgDataRowForm(field, onAction, selectedIndex < 0 ? { ...defaultItem } : { ...rows[selectedIndex] });
                return (<>
                    <Field
                        validationState={field.state.meta.errors.length > 0 ? "error" : "warning"}
                        validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : rows.length === 0 ? t('The table is empty') : null}
                    >
                        <Table noNativeElements>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCellActions 
                                        readonly={readonly}
                                        onClick={(type) => {
                                            onAction({ type, index: -1, drForm });
                                        }}
                                    />
                                    <TableHeaderCellComponent />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, index, rows) => (
                                    <TableRow key={`tr-${index}`} appearance={detailsFormType !== 'inline' && selectedIndex === index ? 'brand' : 'none'}>
                                        <TableCellActions
                                            readonly={readonly}
                                            commands={new Set(detailsFormType !== 'inline' ? ['add', 'delete', 'edit'] : ['add', 'delete'])}
                                            onClick={(type) => {
                                                onAction({ type, index, item: row, drForm });
                                            }}
                                        />
                                        <TableCellComponent 
                                            index={index} 
                                            item={row} 
                                            rows={rows}
                                            readonly={readonly}
                                        />
                                    </TableRow>
                                ))}
                            </TableBody>
                            {TableFooterCellComponent === undefined || rows.length === 0 ? null :
                            <TableHeader>
                                <TableRow><TableFooterCellComponent rows={rows} /></TableRow>
                            </TableHeader>}
                        </Table>
                    </Field>
                    {detailsFormType !== 'inline' ?
                    <dtForm.Subscribe 
                        selector={s => s.values.isDetailsFormOpen}
                        children={(isDetailsFormOpen) => {
                            if (detailsFormType === 'dialog') {
                                return (
                                    <DataGridDialog 
                                        readonly={readonly}
                                        open={isDetailsFormOpen}
                                        onOpenChange={(_, data) => {
                                            onAction({ type: data.open ? 'open' : 'close', drForm });
                                        }}
                                        onAction={onAction}
                                        DialogForm={(props) => {
                                            const { children: Child } = props;
                                            if (!isDetailsFormOpen) return null;
                                            return (
                                                <Child form={drForm} index={selectedIndex} count={rows.length} />
                                            );
                                        }}
                                        DialogTitle={(props) => {
                                            const { form, index, ...dialogTitleProps } = props;
                                            return (
                                                <DialogTitle {...dialogTitleProps}>
                                                    <DetailsTitleComponent index={index} readonly={readonly} />
                                                    <ValidationErrorsMessageBar form={form} />
                                                </DialogTitle>
                                            );
                                        }}
                                        DialogContent={(props) => {
                                            const { form, index } = props;
                                            return (
                                                <DialogContent>
                                                    <DetailsBodyComponent index={index} form={form} readonly={readonly} rows={rows} />
                                                </DialogContent>
                                            );
                                        }}
                                        {...detailsFormProps as DialogProps}
                                    />
                                );
                            }
                            return (
                                <DataGridDrawer 
                                    readonly={readonly}
                                    open={isDetailsFormOpen}
                                    onOpenChange={(_, data) => {
                                        onAction({ type: data.open ? 'open' : 'close', drForm });
                                    }}
                                    onAction={onAction}
                                    DrawerForm={(props) => {
                                        const { children: Child } = props;
                                        if (!isDetailsFormOpen) return null;
                                        return (
                                            <Child form={drForm} index={selectedIndex} count={rows.length} />
                                        );
                                    }}
                                    DrawerHeaderTitle={(props) => {
                                        const { form, index } = props;
                                        return (
                                            <DrawerHeaderTitle>
                                                <DetailsTitleComponent index={index} readonly={readonly} />
                                                <ValidationErrorsMessageBar form={form} />
                                            </DrawerHeaderTitle>
                                        );
                                    }}
                                    DrawerBody={(props) => {
                                        const { form, index, ...drawerBodyProps } = props;
                                        return (
                                            <DrawerBody {...drawerBodyProps}>
                                                <DetailsBodyComponent form={form} index={index} readonly={readonly} rows={rows} />
                                            </DrawerBody>
                                        );
                                    }}
                                    {...detailsFormProps as OverlayDrawerProps}
                                />
                            );
                        }}
                    /> : null}
                </>);
            }}
        />
    );
}
export default (props: DataTableProps) => {
    const field = useFieldContext();
    const { form } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return <View {...{ readonly: isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')), ...props }} />;
}