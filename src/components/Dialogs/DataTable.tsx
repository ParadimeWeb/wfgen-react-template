import { Dialog, DialogActions, DialogBody, DialogSurface, tokens, Toolbar, ToolbarButton, ToolbarDivider, Tooltip, type DialogContentProps, type DialogProps, type DialogTitleProps } from "@fluentui/react-components";
import { AddRegular, ArrowResetRegular, DeleteRegular, NextRegular, PreviousRegular, SaveArrowRightRegular, SaveRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import type { Action, DataRowForm } from "../FormFields/DataTable";

type DataTableDialogProps = {
    DialogForm: ComponentType<{ children: ComponentType<{ form: DataRowForm, index: number, count: number }> }>
    DialogTitle: ComponentType<DialogTitleProps & { form: DataRowForm, index: number }>
    DialogContent: ComponentType<DialogContentProps & { form: DataRowForm, index: number }>
    onAction: (type: Action, index: number) => void
} & Partial<DialogProps>;

export const DataTableDialog = (props: DataTableDialogProps) => {
    const { DialogForm, DialogTitle, DialogContent, onAction, ...dialogProps } = props;
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
                                <DialogTitle form={form} index={index} />
                                <DialogContent form={form} index={index} />
                                <DialogActions fluid>
                                    <Toolbar>
                                        {isArchive ? null : <>
                                        <Tooltip relationship="label" content={t('Delete')} withArrow>
                                            <ToolbarButton icon={<DeleteRegular color={tokens.colorPaletteRedForeground1} />} onClick={() => { onAction('remove_form', index); }} />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t('Add another')} withArrow>
                                            <ToolbarButton icon={<AddRegular />} onClick={() => { onAction('add_form', index); }} />
                                        </Tooltip>
                                        <ToolbarDivider />
                                        <form.Subscribe 
                                            selector={s => s.isDirty}
                                            children={(isDirty) => {
                                                return (<>
                                                    <Tooltip relationship="label" content={t('Reset')} withArrow>
                                                        <ToolbarButton disabled={!isDirty} icon={<ArrowResetRegular />} onClick={() => { form.reset(); }} />
                                                    </Tooltip>
                                                    <Tooltip relationship="label" content={t('Save and close')} withArrow>
                                                        <ToolbarButton disabled={!isDirty} icon={<SaveArrowRightRegular />} onClick={() => { form.handleSubmit({ close: true }); }} />
                                                    </Tooltip>
                                                    <Tooltip relationship="label" content={t('Save')} withArrow>
                                                        <ToolbarButton disabled={!isDirty} icon={<SaveRegular />} onClick={() => { form.handleSubmit(); }} />
                                                    </Tooltip>
                                                </>);
                                            }}
                                        />
                                        <ToolbarDivider />
                                        </>}
                                        <Tooltip relationship="label" content={t('Prev')} withArrow>
                                            <ToolbarButton icon={<PreviousRegular />} disabled={index < 1} onClick={() => { onAction('prev', index); }} />
                                        </Tooltip>
                                        <Tooltip relationship="label" content={t('Next')} withArrow>
                                            <ToolbarButton icon={<NextRegular />} disabled={count === index + 1} onClick={() => { onAction('next', index); }} />
                                        </Tooltip>
                                    </Toolbar>
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    );
                }}
            />
        </Dialog>
    );
}