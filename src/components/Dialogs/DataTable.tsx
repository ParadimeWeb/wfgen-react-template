import { Button, Dialog, DialogActions, DialogBody, DialogSurface, Divider, FluentProvider, type ButtonProps, type DialogContentProps, type DialogProps, type DialogTitleProps } from "@fluentui/react-components";
import { AddRegular, DeleteRegular } from "@fluentui/react-icons";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { redTheme } from "./styles";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";

type DataTableDialogProps = {
    DialogTitle: ComponentType<DialogTitleProps>
    DialogContent: ComponentType<DialogContentProps>
    onAction: (type: 'add' | 'remove' | 'close') => void
    NextButton: ComponentType<ButtonProps>
    PrevButton: ComponentType<ButtonProps>
} & Partial<DialogProps>;

export const DataTableDialog = (props: DataTableDialogProps) => {
    const { DialogTitle, DialogContent, onAction, NextButton, PrevButton, ...dialogProps } = props;
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();

    return (
        <Dialog
            modalType="non-modal"
            {...dialogProps}
        >
            <DialogSurface aria-describedby={undefined}>
                <DialogBody>
                    <DialogTitle />
                    <DialogContent />
                    <DialogActions fluid>
                        {isArchive ? null :
                        <>
                            <FluentProvider theme={redTheme}>
                                <Button appearance="primary" icon={<DeleteRegular />} onClick={() => { onAction('remove') }}>{t('Delete')}</Button>
                            </FluentProvider>
                            <Button icon={<AddRegular />} onClick={() => { onAction('add'); }}>{t('Add another')}</Button>
                            <Divider vertical />
                        </>}
                        <PrevButton />
                        <NextButton />
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}