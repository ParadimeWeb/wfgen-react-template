import { Button, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, Tooltip, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps } from "@fluentui/react-components";
import { AddRegular, ArrowResetRegular, DeleteRegular, Dismiss24Regular, NextRegular, PreviousRegular, SaveArrowRightRegular, SaveRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import type { DataRowForm } from "@wfgen/hooks/useWfgForm";
import type { ActionProps } from "@wfgen/components/FormFields/DataGrid/types";

type DataTableDrawerProps = {
    DrawerForm: ComponentType<{ children: ComponentType<{ form: DataRowForm, index: number, count: number }> }>
    DrawerHeaderTitle: ComponentType<DrawerHeaderTitleProps & { form: DataRowForm, index: number }>
    DrawerBody: ComponentType<DrawerBodyProps & { form: DataRowForm, index: number }>
    onAction: (props: ActionProps) => void
    readonly: boolean
} & Partial<OverlayDrawerProps>;
const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
    },
    body: {
        flex: 'unset'
    },
    spacer: {
        display: 'flex',
        flexGrow: 1
    }
});
export const DataGridDrawer = (props: DataTableDrawerProps) => {
    const { DrawerForm, DrawerHeaderTitle, DrawerBody, onAction, readonly, ...drawerProps } = props;
    const styles = useStyles();
    const { t } = useTranslation();
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
                    const rowIndex = index < 0 ? Math.abs(index + 1) : index;
                    return (<>
                        <DrawerHeader>
                            <DrawerHeaderNavigation className={styles.header}>
                                <Toolbar>
                                    <Tooltip relationship="label" content={t('Prev')} withArrow>
                                        <ToolbarButton icon={<PreviousRegular />} disabled={rowIndex < 1} onClick={() => { onAction({ type: 'prev', index, drForm: form }); }} />
                                    </Tooltip>
                                    <Tooltip relationship="label" content={t('Next')} withArrow>
                                        <ToolbarButton icon={<NextRegular />} disabled={count <= rowIndex + 1} onClick={() => { onAction({ type: 'next', index, drForm: form }); }} />
                                    </Tooltip>
                                </Toolbar>
                                <Button 
                                    appearance="subtle"
                                    aria-label={t('Close')}
                                    icon={<Dismiss24Regular />}
                                    onClick={() => { 
                                        onAction({ type: 'close', index, drForm: form });
                                    }}
                                />
                            </DrawerHeaderNavigation>
                            <DrawerHeaderTitle form={form} index={index} />
                        </DrawerHeader>
                        <DrawerBody className={styles.body} form={form} index={index} />
                        {readonly ? null : (
                            <DrawerFooter>
                                <form.Subscribe 
                                    selector={s => [s.isDirty, s.canSubmit]}
                                    children={([isDirty, canSubmit]) => {
                                        return (<>
                                            <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true, index }); }}>{t('Save and close')}</Button>
                                            <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveRegular />} onClick={() => { form.handleSubmit({ close: false, index }); }}>{t('Save')}</Button>
                                            <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                <Button disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                            </Tooltip>
                                        </>);
                                    }}
                                />
                                {index < 0 ? null : <>
                                <div className={styles.spacer}></div>
                                <Tooltip relationship="label" content={t('Add another')} withArrow>
                                    <Button icon={<AddRegular />} onClick={() => { 
                                        onAction({ type: 'add_form', index, drForm: form }); 
                                    }} />
                                </Tooltip>
                                <Tooltip relationship="label" content={t('Delete')} withArrow>
                                    <Button icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction({ type: 'remove_form', index, drForm: form }); }} />
                                </Tooltip></>}
                            </DrawerFooter>
                        )}
                    </>);
                }}
            />
        </OverlayDrawer>
    );
}