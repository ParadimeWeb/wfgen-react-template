import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { Button, TableCellActions, tokens } from "@fluentui/react-components";
import { AddFilled, AddRegular, bundleIcon, DeleteFilled, DeleteRegular, EditFilled, EditRegular, OpenFilled, OpenRegular } from "@fluentui/react-icons";

const EditIcon = bundleIcon(EditFilled, EditRegular);
const AddIcon = bundleIcon(AddFilled, AddRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ViewIcon = bundleIcon(OpenFilled, OpenRegular);

export type CellActionsProps = {
    onClick: (type: 'edit' | 'add' | 'remove') => void
};
export const NoRowsCellActions = (props: CellActionsProps) => {
    const { onClick } = props;
    const { t } = useTranslation();
    return (
        <Button aria-label={t('Add')} icon={<AddIcon />} onClick={() => { onClick('add'); }}>{t('Add first item')}</Button>
    );
}
export const CellActions = (props: CellActionsProps) => {
    const { onClick } = props;
    const { isArchive } = useFormInitQuery();
    const { t } = useTranslation();
    return (
        <TableCellActions>
            <Button 
                icon={isArchive ? <ViewIcon /> : <EditIcon />} 
                appearance="subtle" 
                aria-label={isArchive ? t('View') : t('Edit')}
                onClick={() => { onClick('edit'); }}
            />
            {isArchive ? null : <>
            <Button 
                icon={<AddIcon />} 
                appearance="subtle" 
                aria-label={t('Add')} 
                onClick={() => { onClick('add'); }} 
            />
            <Button 
                icon={<DeleteIcon color={tokens.colorPaletteRedForeground1} />} 
                appearance="subtle" 
                aria-label={t('Delete')} 
                onClick={() => { onClick('remove'); }} 
            />
            </>}
        </TableCellActions>
    );
}