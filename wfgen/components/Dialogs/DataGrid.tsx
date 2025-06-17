import { Button, Dialog, DialogActions, DialogBody, DialogSurface, makeStyles, tokens, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, type DialogContentProps, type DialogProps, type DialogTitleProps } from "@fluentui/react-components";
import { AddRegular, ArrowResetRegular, DeleteRegular, DismissRegular, NextRegular, PreviousRegular, SaveArrowRightRegular, SaveRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import type { DataRowForm } from "@wfgen/hooks/useWfgForm";
import type { ActionProps } from "@wfgen/components/FormFields/DataGrid/types";

const useStyles = makeStyles({
    dialogActions: {
        justifySelf: 'stretch'
    },
    spacer: {
        display: 'flex',
        flexGrow: 1
    }
});

type DataTableDialogProps = {
    DialogForm: ComponentType<{ children: ComponentType<{ form: DataRowForm, index: number, count: number }> }>
    DialogTitle: ComponentType<DialogTitleProps & { form: DataRowForm, index: number }>
    DialogContent: ComponentType<DialogContentProps & { form: DataRowForm, index: number }>
    onAction: (props: ActionProps) => void
    readonly: boolean
} & Partial<DialogProps>;

export const DataGridDialog = (props: DataTableDialogProps) => {
    const { DialogForm, DialogTitle, DialogContent, onAction, readonly, ...dialogProps } = props;
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <Dialog
            modalType="non-modal"
            {...dialogProps}
        >
            <DialogForm 
                children={(props) => {
                    const { form, index, count } = props;
                    const rowIndex = index < 0 ? Math.abs(index + 1) : index;
                    return (
                        <DialogSurface aria-describedby={undefined}>
                            <DialogBody>
                                <DialogTitle form={form} index={index} 
                                    action={
                                        <Toolbar>
                                            <Tooltip relationship="label" content={t('Prev')} withArrow>
                                                <ToolbarButton icon={<PreviousRegular />} disabled={rowIndex < 1} onClick={() => { onAction({ type: 'prev', index, drForm: form }); }} />
                                            </Tooltip>
                                            <Tooltip relationship="label" content={t('Next')} withArrow>
                                                <ToolbarButton icon={<NextRegular />} disabled={count <= rowIndex + 1} onClick={() => { onAction({ type: 'next', index, drForm: form }); }} />
                                            </Tooltip>
                                            <ToolbarDivider />
                                            <ToolbarButton aria-label={t('Close')} icon={<DismissRegular />} onClick={() => { onAction({ type: 'close', index, drForm: form }); }} />
                                        </Toolbar>
                                    } 
                                />
                                <DialogContent form={form} index={index} />
                                <DialogActions fluid className={styles.dialogActions}>
                                        {readonly ? null : <>
                                        {index < 0 ? null : <>
                                        <Tooltip relationship="label" content={t('Delete')} withArrow>
                                            <Button icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction({ type: 'remove_form', index, drForm: form }); }} />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t('Add another')} withArrow>
                                            <Button 
                                                icon={<AddRegular />} 
                                                onClick={() => { 
                                                    onAction({ type: 'add_form', index, drForm: form }); 
                                                }} 
                                            />
                                        </Tooltip>
                                        <div className={styles.spacer}></div>
                                        </>}
                                        <form.Subscribe 
                                            selector={s => [s.isDirty, s.canSubmit]}
                                            children={([isDirty, canSubmit]) => {
                                                return (<>
                                                    <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                        <Button disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                                    </Tooltip>
                                                    <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveRegular />} onClick={() => { form.handleSubmit({ close: false, index }); }}>{t('Save')}</Button>
                                                    <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true, index }); }}>{t('Save and close')}</Button>
                                                </>);
                                            }}
                                        />
                                        </>}
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    );
                }}
            />
        </Dialog>
    );
}