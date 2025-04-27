import { Button, Dialog, DialogActions, DialogBody, DialogSurface, makeStyles, tokens, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, type DialogContentProps, type DialogProps, type DialogTitleProps } from "@fluentui/react-components";
import { AddRegular, ArrowResetRegular, DeleteRegular, DismissRegular, NextRegular, PreviousRegular, SaveArrowRightRegular, SaveRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { RowAction } from "../../types";
import type { DataRowForm } from "../../hooks/useWfgForm";

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
    onAction: (type: RowAction, index: number) => void
} & Partial<DialogProps>;

export const DataGridDialog = (props: DataTableDialogProps) => {
    const { DialogForm, DialogTitle, DialogContent, onAction, ...dialogProps } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();

    return (
        <Dialog
            modalType="non-modal"
            {...dialogProps}
        >
            <DialogForm 
                children={(props) => {
                    const { form, index, count } = props;
                    return (
                        <DialogSurface aria-describedby={undefined}>
                            <DialogBody>
                                <DialogTitle form={form} index={index} 
                                    action={
                                        <Toolbar>
                                            <Tooltip relationship="label" content={t('Prev')} withArrow>
                                                <ToolbarButton icon={<PreviousRegular />} disabled={index < 1} onClick={() => { onAction('prev', index); }} />
                                            </Tooltip>
                                            <Tooltip relationship="label" content={t('Next')} withArrow>
                                                <ToolbarButton icon={<NextRegular />} disabled={count === index + 1} onClick={() => { onAction('next', index); }} />
                                            </Tooltip>
                                            <ToolbarDivider />
                                            <ToolbarButton aria-label={t('Close')} icon={<DismissRegular />} onClick={() => { onAction('close', index); }} />
                                        </Toolbar>
                                    } 
                                />
                                <DialogContent form={form} index={index} />
                                <DialogActions fluid className={styles.dialogActions}>
                                        {isArchive ? null : <>
                                        <Tooltip relationship="label" content={t('Delete')} withArrow>
                                            <Button icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction('remove_form', index); }} />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t('Add another')} withArrow>
                                            <Button icon={<AddRegular />} onClick={() => { onAction('add_form', index); }} />
                                        </Tooltip>
                                        <div className={styles.spacer}></div>
                                        <form.Subscribe 
                                            selector={s => [s.isDirty, s.canSubmit]}
                                            children={([isDirty, canSubmit]) => {
                                                return (<>
                                                    <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                        <Button disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                                    </Tooltip>
                                                    <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveRegular />} onClick={() => { form.handleSubmit(); }}>{t('Save')}</Button>
                                                    <Button appearance="primary" disabled={!isDirty || !canSubmit} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true }); }}>{t('Save and close')}</Button>
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