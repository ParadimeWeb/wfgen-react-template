import { Button, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, makeStyles, OverlayDrawer, tokens, Toolbar, ToolbarButton, Tooltip, type DrawerBodyProps, type DrawerHeaderTitleProps, type OverlayDrawerProps } from "@fluentui/react-components";
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
                        <DrawerBody className={styles.body} form={form} index={index} />
                        {isArchive ? null : (
                            <DrawerFooter>
                                <form.Subscribe 
                                    selector={s => [s.isDirty, s.canSubmit]}
                                    children={([isDirty, canSubmit]) => {
                                        return (<>
                                            <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true }); }}>{t('Save and close')}</Button>
                                            <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveRegular />} onClick={() => { form.handleSubmit(); }}>{t('Save')}</Button>
                                            <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                <Button disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                            </Tooltip>
                                        </>);
                                    }}
                                />
                                <div className={styles.spacer}></div>
                                <Tooltip relationship="label" content={t('Add another')} withArrow>
                                    <Button icon={<AddRegular />} onClick={() => { onAction('add_form', index); }} />
                                </Tooltip>
                                <Tooltip relationship="label" content={t('Delete')} withArrow>
                                    <Button icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction('remove_form', index); }} />
                                </Tooltip>
                            </DrawerFooter>
                        )}
                    </>);
                }}
            />
        </OverlayDrawer>
    );
}