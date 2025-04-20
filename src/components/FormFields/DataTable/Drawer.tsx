import { DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, ToolbarGroup, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, Dismiss24Regular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

type DataTableDrawerProps = {
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps>
    DrawerBody: ComponentType<DrawerBodyProps>
    onAction: (type: 'add' | 'remove' | 'close') => void
} & Partial<OverlayDrawerProps>;
const useStyles = makeStyles({
    toolbar: {
        justifyContent: "space-between"
    }
});
export const DataTableDrawer = (props: DataTableDrawerProps) => {
    const { DrawerHeaderTitle, DrawerBody, onAction, ...drawerProps } = props;
    const styles = useStyles();
    const { t } = useTranslation();
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
                        <ToolbarGroup>
                            <ToolbarButton icon={<AddRegular />} appearance="subtle" onClick={() => { onAction('add'); }}>{t('Add another')}</ToolbarButton>
                            <ToolbarButton icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} appearance="subtle" onClick={() => { onAction('remove') }}>{t('Delete')}</ToolbarButton>
                        </ToolbarGroup>
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