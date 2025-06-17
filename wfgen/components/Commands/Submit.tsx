import { useIsMutating } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MenuItem, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { SendRegular } from "@fluentui/react-icons";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { forwardRef } from "react";

export const SubmitButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <form.Subscribe 
            selector={s => s.canSubmit}
            children={canSubmit => {
                return (
                    <form.Field 
                        name="Table1[0].FORM_ACTION"
                        children={field => {
                            return (
                                <ToolbarButton 
                                    ref={ref}
                                    disabled={isMutating || !canSubmit}
                                    icon={<SendRegular />} 
                                    onClick={() => { field.handleChange("CONFIRM_SUBMIT"); }}
                                >
                                    {t('Submit')}
                                </ToolbarButton>
                            );
                        }}
                    />
                );
            }}
        />
    );
    
});
export const SubmitIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <form.Subscribe 
            selector={s => s.canSubmit}
            children={canSubmit => {
                return (
                    <form.Field 
                        name="Table1[0].FORM_ACTION"
                        children={field => {
                            return (
                                <Tooltip content={t('Submit')} relationship="label" positioning="below" withArrow>
                                    <ToolbarButton
                                        ref={ref}
                                        disabled={isMutating || !canSubmit}
                                        icon={<SendRegular />} 
                                        onClick={() => { field.handleChange("CONFIRM_SUBMIT"); }}
                                    />
                                </Tooltip>
                            );
                        }}
                    />
                );
            }}
        />
    );
});
export const SubmitMenuItem = () => {
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <form.Subscribe 
            selector={s => s.canSubmit}
            children={canSubmit => {
                return (
                    <form.Field 
                        name="Table1[0].FORM_ACTION"
                        children={field => {
                            return (
                                <MenuItem 
                                    disabled={isMutating || !canSubmit}
                                    icon={<SendRegular />} 
                                    onClick={async () => { field.handleChange("CONFIRM_SUBMIT"); }}
                                >
                                    {t('Submit')}
                                </MenuItem>
                            );
                        }}
                    />
                );
            }}
        />
    );
};