import { Button, Table, TableBody, TableCell, TableCellActions, TableCellLayout, TableHeader, TableHeaderCell, TableRow, tokens, useTableColumnSizing_unstable, useTableFeatures, type OverlayDrawerProps, type TableColumnDefinition, type TableColumnSizingOptions, type TableRowData } from "@fluentui/react-components";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";
import { useForm, type AnyFieldApi, type AnyFormApi } from "@tanstack/react-form";
import type { ComponentType } from "react";
import { AddFilled, AddRegular, bundleIcon, DeleteFilled, DeleteRegular, EditFilled, EditRegular, OpenFilled, OpenRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { DataTableDrawer } from "./Drawer";

const EditIcon = bundleIcon(EditFilled, EditRegular);
const AddIcon = bundleIcon(AddFilled, AddRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ViewIcon = bundleIcon(OpenFilled, OpenRegular);

export type RowProps = {
    item: DataRow
    index: number
    rows: TableRowData<DataRow>[]
    columnSizing_unstable: ReturnType<typeof useTableFeatures<DataRow>>['columnSizing_unstable']
    renderActions: () => JSX.Element
};
export type DetailsProps = {
    index: number
};
export type DataTableProps = {
    columnsDef: TableColumnDefinition<DataRow>[]
    columnSizingOptions: TableColumnSizingOptions
    RowComponent: ComponentType<RowProps>
    DetailsComponent: ComponentType<DetailsProps>
    drawerProps?: OverlayDrawerProps
};

const Actions = (props: { form: AnyFormApi, index: number }) => {
    const { form, index } = props;
    const { isArchive } = useFormInitQuery();
    const { t } = useTranslation();
    return (
        <TableCellActions>
            <Button 
                icon={isArchive ? <ViewIcon /> : <EditIcon />} 
                appearance="subtle" 
                aria-label={isArchive ? t('View') : t('Edit')}
                onClick={() => {
                    form.setFieldValue('isDrawerOpen', true);
                    form.setFieldValue('selectedIndex', index);
                }}
            />
            <Button 
                icon={<AddIcon />} 
                appearance="subtle" 
                aria-label={t('Add')} 
                onClick={() => {
                    form.setFieldValue('isDrawerOpen', true);
                    form.setFieldValue('selectedIndex', index);
                }} 
            />
            <Button 
                icon={<DeleteIcon color={tokens.colorPaletteRedForeground1} />} 
                appearance="subtle" 
                aria-label={t('Delete')} 
                onClick={() => {
                    
                }} 
            />
        </TableCellActions>
    );
}
function View(props: DataTableProps) {
    const { columnsDef, columnSizingOptions, RowComponent, DetailsComponent, drawerProps = {} } = props;
    const { t } = useTranslation();
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
                {rows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <TableCellLayout>
                                <Button aria-label={t('Add')} icon={<AddIcon />} appearance="subtle" onClick={() => {}}>{t('Add first item')}</Button>
                            </TableCellLayout>
                        </TableCell>
                    </TableRow>
                ) : null}
                {rows.map(({ item }, index, rows) => <RowComponent key={`datatablerow-${index}`} index={index} item={item} rows={rows} columnSizing_unstable={columnSizing_unstable} renderActions={() => <Actions form={tableForm} index={index} />} />)}
            </TableBody>
        </Table>
        <tableForm.Subscribe 
            selector={s => s.values.isDrawerOpen}
            children={(isDrawerOpen) => (
                <DataTableDrawer 
                    {...drawerProps} 
                    form={tableForm} 
                    open={isDrawerOpen} 
                    details={<tableForm.Subscribe selector={s => s.values.selectedIndex} children={(selectedIndex) => <DetailsComponent index={selectedIndex} />} />}
                />
            )}
        />
    </>);
}
export default (props: DataTableProps) => {
    return <View {...props} />;
}