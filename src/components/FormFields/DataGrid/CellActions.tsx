import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { Button, TableCellActions, tokens } from "@fluentui/react-components";
import { AddFilled, AddRegular, AddSquareRegular, bundleIcon, DeleteFilled, DeleteRegular, EditFilled, EditRegular, OpenFilled, OpenRegular } from "@fluentui/react-icons";
import type { RowAction } from "../../../types";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";

const EditIcon = bundleIcon(EditFilled, EditRegular);
const AddIcon = bundleIcon(AddFilled, AddRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ViewIcon = bundleIcon(OpenFilled, OpenRegular);

export type CellActionsProps = {
    onClick: (type: RowAction) => void
    commands?: Set<'edit' | 'add' | 'delete'>
};
export const NoRowsCellActions = (props: CellActionsProps) => {
    const { onClick } = props;
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    if (isArchive || isPrintView) return null;
    return (
        <Button appearance="subtle" size="small" aria-label={t('Add')} icon={<AddSquareRegular />} onClick={() => { onClick('add_cell'); }} />
    );
}
export const CellActions = (props: CellActionsProps) => {
    const { onClick, commands = new Set(['edit', 'add', 'delete']) } = props;
    const { isArchive } = useFormInitQuery();
    const { t } = useTranslation();
    return (
        <TableCellActions>
            {commands.has('edit') ?
            <Button 
                icon={isArchive ? <ViewIcon /> : <EditIcon />} 
                appearance="subtle" 
                aria-label={isArchive ? t('View') : t('Edit')}
                onClick={() => { onClick('edit'); }}
            /> : null}
            {isArchive ? null : <>
            {commands.has('add') ?
            <Button 
                icon={<AddIcon />} 
                appearance="subtle" 
                aria-label={t('Add')} 
                onClick={() => { onClick('add_cell'); }} 
            /> : null}
            {commands.has('delete') ?
            <Button 
                icon={<DeleteIcon color={tokens.colorPaletteRedForeground1} />} 
                appearance="subtle" 
                aria-label={t('Delete')} 
                onClick={() => { onClick('remove_cell'); }} 
            /> : null}
            </>}
        </TableCellActions>
    );
}