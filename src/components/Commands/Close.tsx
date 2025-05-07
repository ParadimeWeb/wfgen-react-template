import { MenuItem, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useIsMutating } from "@tanstack/react-query";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";

export const CloseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    const { closeForm } = useFormInitQuery();
    return (
        <ToolbarButton
            disabled={isMutating}
            ref={ref}
            icon={<DismissRegular />}
            onClick={closeForm}
        >
            {t('Close')}
        </ToolbarButton>
    );
});
export const CloseIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    const { closeForm } = useFormInitQuery();
    return isMutating ? (
        <ToolbarButton 
            disabled
            ref={ref}
            icon={<DismissRegular />}
        />
    ) : (
        <Tooltip 
            withArrow
            content={t('Close')}
            relationship="label"
            positioning="below"
        >
            <ToolbarButton
                ref={ref}
                icon={<DismissRegular />}
                onClick={closeForm}
            />
        </Tooltip>
    );
});
export const CloseMenuItem = () => {
    const { t } = useTranslation();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    const { closeForm } = useFormInitQuery();
    return (
        <MenuItem
            disabled={isMutating}
            icon={<DismissRegular />} 
            onClick={closeForm}
        >
            {t('Close')}
        </MenuItem>
    );
};