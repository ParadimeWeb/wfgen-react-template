import { DrawerBody, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, ToolbarGroup, type OverlayDrawerProps } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, Dismiss24Regular } from "@fluentui/react-icons";
import type { AnyFormApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

type DataTableDrawerProps = {
    details: JSX.Element
    form: AnyFormApi
} & Partial<OverlayDrawerProps>;
const useStyles = makeStyles({
    toolbar: {
        justifyContent: "space-between"
    }
});
export const DataTableDrawer = (props: DataTableDrawerProps) => {
    const { details, form, open } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    return (
        <OverlayDrawer
            modalType="non-modal"
            position="end"
            size="medium"
            open={open}
            onOpenChange={async (_, data) => {
                form.setFieldValue('isDrawerOpen', data.open);
                // switch(data.type) {
                //     case "backdropClick":
                //     case "escapeKeyDown":
                //         onClose();
                //         break;
                //     default:
                //         setNonConformityDrawerOpen(data.open);
                //         break;
                // }
            }}
        >
            <DrawerHeader>
                <DrawerHeaderNavigation>
                    <Toolbar className={styles.toolbar}>
                        <ToolbarGroup>
                            <ToolbarButton icon={<AddRegular />} appearance="subtle" onClick={() => {}}>{t('Add another')}</ToolbarButton>
                            <ToolbarButton icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} appearance="subtle">{t('Delete')}</ToolbarButton>
                        </ToolbarGroup>
                        <ToolbarButton 
                            appearance="subtle"
                            aria-label={t('Close')}
                            icon={<Dismiss24Regular />}
                            onClick={() => { form.setFieldValue('isDrawerOpen', false); }}
                        />
                    </Toolbar>
                </DrawerHeaderNavigation>
                <DrawerHeaderTitle>
                    Title
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                {details}
            </DrawerBody>
        </OverlayDrawer>
    );
}