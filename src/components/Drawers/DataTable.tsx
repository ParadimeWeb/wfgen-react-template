import { Button, DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps } from "@fluentui/react-components";
import { AddRegular, ArrowResetRegular, DeleteRegular, Dismiss24Regular, NextRegular, PreviousRegular, SaveArrowRightRegular, SaveRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { RowAction } from "../../types";
import type { DataRowForm } from "../../hooks/useWfgForm";

type DataTableDrawerProps = {
    DrawerForm: ComponentType<{ children: ComponentType<{ form: DataRowForm, index: number, count: number }> }>
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps & { form: DataRowForm, index: number }>
    DrawerBody: ComponentType<DrawerBodyProps & { form: DataRowForm, index: number }>
    onAction: (type: RowAction, index: number) => void
} & Partial<OverlayDrawerProps>;
const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
    }
});
export const DataTableDrawer = (props: DataTableDrawerProps) => {
    const { DrawerForm, DrawerHeaderTitle, DrawerBody, onAction, ...drawerProps } = props;
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
                children={(props) => {
                    const { form, index, count } = props;
                    return (<>
                        <DrawerHeader>
                            <DrawerHeaderNavigation className={styles.header}>
                                <Toolbar>
                                    <Tooltip relationship="label" content={t('Prev')} withArrow>
                                        <ToolbarButton icon={<PreviousRegular />} disabled={index < 1} onClick={() => { onAction('prev', index); }} />
                                    </Tooltip>
                                    <Tooltip relationship="label" content={t('Next')} withArrow>
                                        <ToolbarButton icon={<NextRegular />} disabled={count === index + 1} onClick={() => { onAction('next', index); }} />
                                    </Tooltip>
                                    {isArchive ? null : <>
                                    <ToolbarDivider />
                                    <form.Subscribe 
                                        selector={s => s.isDirty}
                                        children={(isDirty) => {
                                            return (<>
                                                <Tooltip relationship="label" content={t('Save')} withArrow>
                                                    <ToolbarButton disabled={!isDirty} icon={<SaveRegular />} onClick={() => { form.handleSubmit(); }} />
                                                </Tooltip>
                                                <Tooltip relationship="label" content={t('Save and close')} withArrow>
                                                    <ToolbarButton disabled={!isDirty} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true }); }} />
                                                </Tooltip>
                                                <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                    <ToolbarButton disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                                </Tooltip>
                                            </>);
                                        }}
                                    />
                                    <ToolbarDivider />
                                    <Tooltip relationship="label" content={t('Add another')} withArrow>
                                        <ToolbarButton icon={<AddRegular />} onClick={() => { onAction('add_form', index); }} />
                                    </Tooltip>
                                    <Tooltip relationship="label" content={t('Delete')} withArrow>
                                        <ToolbarButton icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction('remove_form', index); }} />
                                    </Tooltip>
                                    </>}
                                </Toolbar>
                                <Button 
                                    appearance="subtle"
                                    aria-label={t('Close')}
                                    icon={<Dismiss24Regular />}
                                    onClick={() => { 
                                        onAction('close', index);
                                    }}
                                />
                            </DrawerHeaderNavigation>
                            <DrawerHeaderTitle form={form} index={index} />
                        </DrawerHeader>
                        <DrawerBody form={form} index={index} />
                    </>);
                }}
            />
        </OverlayDrawer>
    );
}