import { MenuItem, Spinner, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { SaveRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { forwardRef } from "react";
import { postWithFormData } from "@wfgen/utils";

export const SaveButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { form } = useWfgFormContext();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { isPending, mutate } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });

    return isPending ? 
        <Spinner size="tiny" label={t('Saving...')} />
        : 
        <ToolbarButton 
            ref={ref}
            icon={<SaveRegular />} 
            onClick={() => {
                queryClient.cancelQueries({ queryKey: ['autosave'] });
                form.state.values.Table1[0].FORM_ACTION = 'ASYNC_SAVE';
                mutate({ formData: form.state.values });
            }}
        >
            {t('Save')}
        </ToolbarButton>;
});

export const SaveIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { form } = useWfgFormContext();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { mutate, isPending } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return isPending ? 
        <Spinner size="tiny" /> : 
        <Tooltip content={t('Save')} relationship="label" positioning="below" withArrow>
            <ToolbarButton 
                ref={ref}
                disabled={isMutating}
                icon={<SaveRegular />} 
                onClick={() => {
                    queryClient.cancelQueries({ queryKey: ['autosave'] });
                    form.state.values.Table1[0].FORM_ACTION = 'ASYNC_SAVE';
                    mutate({ formData: form.state.values });
                }}
            />
        </Tooltip>;
});
export const SaveMenuItem = () => {
    const { form } = useWfgFormContext();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { mutate, isPending } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <MenuItem 
            disabled={isMutating}
            icon={<SaveRegular />} 
            onClick={() => {
                queryClient.cancelQueries({ queryKey: ['autosave'] });
                form.state.values.Table1[0].FORM_ACTION = 'ASYNC_SAVE';
                mutate({ formData: form.state.values });
            }}
        >
            {t(isPending ? 'Saving...' : 'Save')}
        </MenuItem>
    );
};