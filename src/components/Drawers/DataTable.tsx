import { DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, ToolbarGroup, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps, type ToolbarButtonProps } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, Dismiss24Regular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";

type DataTableDrawerProps = {
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps>
    DrawerBody: ComponentType<DrawerBodyProps>
    NextButton: ComponentType<ToolbarButtonProps>
    PrevButton: ComponentType<ToolbarButtonProps>
    onAction: (type: 'add' | 'remove' | 'close') => void
} & Partial<OverlayDrawerProps>;
const useStyles = makeStyles({
    toolbar: {
        justifyContent: "space-between"
    }
});
export const DataTableDrawer = (props: DataTableDrawerProps) => {
    const { DrawerHeaderTitle, DrawerBody, onAction, PrevButton, NextButton, ...drawerProps } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    return (
        <OverlayDrawer
            modalType="non-modal"
            position="end"
            size="medium"
            {...drawerProps}
        >
            <DrawerHeader>
                <DrawerHeaderNavigation>
                    <Toolbar className={styles.toolbar}>
                        {isArchive ? null :
                        <ToolbarGroup>
                            <ToolbarButton icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} appearance="subtle" onClick={() => { onAction('remove') }}>{t('Delete')}</ToolbarButton>
                            <ToolbarButton icon={<AddRegular />} appearance="subtle" onClick={() => { onAction('add'); }}>{t('Add another')}</ToolbarButton>
                            <PrevButton />
                            <NextButton />
                        </ToolbarGroup>
                        }
                        <ToolbarButton 
                            appearance="subtle"
                            aria-label={t('Close')}
                            icon={<Dismiss24Regular />}
                            onClick={() => { onAction('close'); }}
                        />
                    </Toolbar>
                </DrawerHeaderNavigation>
                <DrawerHeaderTitle />
            </DrawerHeader>
            <DrawerBody />
        </OverlayDrawer>
    );
}