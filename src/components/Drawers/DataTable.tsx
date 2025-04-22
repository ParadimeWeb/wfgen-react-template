import { DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, ToolbarGroup, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps, type ToolbarButtonProps } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, Dismiss24Regular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { DataRowForm } from "../FormFields/DataTable";
import { ValidationErrorsMessageBar } from "../FormFields/DataTable/ValidationErrorsMessageBar";

type DataTableDrawerProps = {
    DrawerForm: ComponentType<{ children: ComponentType<{ form: DataRowForm, index: number }> }>
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps & { form: DataRowForm, index: number }>
    DrawerBody: ComponentType<DrawerBodyProps & { form: DataRowForm, index: number }>
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
    const { DrawerForm, DrawerHeaderTitle, DrawerBody, onAction, PrevButton, NextButton, ...drawerProps } = props;
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
            <DrawerForm 
                children={({ form, index }) => {
                    return (<>
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
                                        onClick={() => { 
                                            form.handleSubmit();
                                            //onAction('close'); 
                                        }}
                                    />
                                </Toolbar>
                            </DrawerHeaderNavigation>
                            <DrawerHeaderTitle form={form} index={index} />
                            <ValidationErrorsMessageBar form={form} />
                        </DrawerHeader>
                        <DrawerBody form={form} index={index} />
                    </>);
                }}
            />
        </OverlayDrawer>
    );
}