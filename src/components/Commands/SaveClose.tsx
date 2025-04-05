import { MenuItem, Spinner, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { SaveArrowRightRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWfgFormContext } from "../../hooks/useWfgFormContext";
import { forwardRef } from "react";
import { postWithFormData } from "../../utils";

export const SaveCloseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const { isPending, mutate } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });

    return isPending ? 
        <Spinner size="tiny" label={t('Saving...')} /> : 
        <ToolbarButton 
            ref={ref}
            icon={<SaveArrowRightRegular />} 
            onClick={() => {
                queryClient.cancelQueries({ queryKey: ['autosave'] });
                mutate(form.state.values, {
                    onSuccess: () => {
                        console.log('TODO: Close the form');
                    }
                });
            }}
        >
            {t('Save and Close')}
        </ToolbarButton>;
});
export const SaveCloseIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const { mutate, isPending } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return isPending ? 
        <Spinner size="tiny" /> : 
        <Tooltip content={t('Save and Close')} relationship="label" positioning="below">
            <ToolbarButton 
                ref={ref}
                disabled={isMutating}
                icon={<SaveArrowRightRegular />} 
                onClick={() => {
                    queryClient.cancelQueries({ queryKey: ['autosave'] });
                    mutate(form.state.values, {
                        onSuccess: () => {
                            console.log('TODO: Close the form');
                        }
                    });
                }}
            />
        </Tooltip>;
});
export const SaveCloseMenuItem = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const { mutate, isPending } = useMutation({
        mutationKey: ['save'],
        mutationFn: postWithFormData
    });
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <MenuItem 
            disabled={isMutating}
            icon={<SaveArrowRightRegular />} 
            onClick={() => {
                queryClient.cancelQueries({ queryKey: ['autosave'] });
                mutate(form.state.values, {
                    onSuccess: () => {
                        console.log('TODO: Close the form');
                    }
                });
            }}
        >
            {t(isPending ? 'Saving...' : 'Save and Close')}
        </MenuItem>
    );
};