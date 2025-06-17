import { useTranslation } from "react-i18next";
import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton, TableCell, TableHeaderCell, tokens, Tooltip } from "@fluentui/react-components";
import { AddFilled, AddRegular, AddSquareRegular, bundleIcon, DeleteFilled, DeleteRegular, EditFilled, EditRegular, OpenFilled, OpenRegular } from "@fluentui/react-icons";
import type { RowAction } from "@wfgen/types";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";

const EditIcon = bundleIcon(EditFilled, EditRegular);
const AddIcon = bundleIcon(AddFilled, AddRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ViewIcon = bundleIcon(OpenFilled, OpenRegular);

export type CellActionsProps = {
    onClick: (type: RowAction) => void
    commands?: Set<'edit' | 'add' | 'delete'>
    readonly: boolean
};
export const TableHeaderCellActions = (props: CellActionsProps) => {
    const { onClick, readonly } = props;
    const { t } = useTranslation();
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    if (isPrintView) return null;
    return (
        <TableHeaderCell style={{ width: 64, maxWidth: 64, minWidth: 64 }}>
            {readonly ? null :
            <Button appearance="subtle" size="small" aria-label={t('Add')} icon={<AddSquareRegular />} onClick={() => { onClick('add_cell'); }} />}
        </TableHeaderCell>
    );
}
export const TableCellActions = (props: CellActionsProps) => {
    const { onClick, commands = new Set(['edit', 'add', 'delete']), readonly } = props;
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { t } = useTranslation();
    if (isPrintView) return null;
    if (!readonly && (commands.has('add') || commands.has('delete'))) {
        return (
            <TableCell style={{ width: 64, maxWidth: 64, minWidth: 64 }}>
                <Menu hasIcons>
                    <MenuTrigger disableButtonEnhancement>
                        {(triggerProps) => commands.has('edit') ? (
                            <Tooltip content={readonly ? t('View') : t('Edit')} relationship="inaccessible">
                                <SplitButton 
                                    menuButton={triggerProps}
                                    primaryActionButton={{
                                        onClick: () => { onClick('edit'); }
                                    }}
                                    icon={readonly ? <ViewIcon /> : <EditIcon />}
                                />
                            </Tooltip>
                        ) : (
                            <MenuButton />
                        )}
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {commands.has('add') ?
                            <MenuItem
                                icon={<AddIcon />}
                                onClick={() => { onClick('add_cell'); }} 
                            >
                                {t('Add')}
                            </MenuItem>
                            : null}
                            {commands.has('delete') ? <>
                            <MenuDivider />
                            <MenuItem
                                icon={<DeleteIcon color={tokens.colorPaletteRedForeground1} />}
                                onClick={() => { onClick('remove_cell'); }} 
                            >
                                {t('Delete')}
                            </MenuItem>
                            </>: null}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </TableCell>
        );
    }
    if (!commands.has('edit')) {
       return null; 
    }
    return (
        <TableCell style={{ width: 64, maxWidth: 64, minWidth: 64 }}>
            <Tooltip content={readonly ? t('View') : t('Edit')} relationship="inaccessible">
                <Button 
                    onClick={() => { onClick('edit'); }}
                    icon={readonly ? <ViewIcon /> : <EditIcon />}
                />
            </Tooltip>
        </TableCell>
    );
}