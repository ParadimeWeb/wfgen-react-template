import { makeStyles, MenuItem, tokens, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { useIsMutating } from "@tanstack/react-query";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../Form/Provider";

const useStyles = makeStyles({
    redIconButton: {
        '& .fui-Button__icon': {
            color: tokens.colorPaletteRedForeground1
        },
        ':hover .fui-Button__icon': {
            color: tokens.colorPaletteRedForeground2
        },
        ':hover:active .fui-Button__icon': {
            color: tokens.colorPaletteRedForeground3
        }
    },
    redIconMenuItem: {
        '& .fui-MenuItem__icon': {
            color: tokens.colorPaletteRedForeground1
        },
        ':hover .fui-MenuItem__icon': {
            color: tokens.colorPaletteRedForeground2
        },
        ':hover:active .fui-MenuItem__icon': {
            color: tokens.colorPaletteRedForeground3
        }
    }
});

export const CancelButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <ToolbarButton
                        disabled={isMutating}
                        ref={ref}
                        className={styles.redIconButton}
                        icon={<DismissRegular />}
                        onClick={() => { field.handleChange('CONFIRM_CANCEL'); }}
                    >
                        {t('Cancel')}
                    </ToolbarButton>
                );
            }}
        />
    );
});
export const CancelIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    return isMutating ? (
        <ToolbarButton 
            disabled
            ref={ref}
            icon={<DismissRegular />}
        />
    ) : (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <Tooltip 
                        content={t('Cancel')}
                        relationship="label"
                        positioning="below"
                    >
                        <ToolbarButton
                            ref={ref}
                            className={styles.redIconButton}
                            icon={<DismissRegular />}
                            onClick={() => { field.handleChange('CONFIRM_CANCEL'); }}
                        />
                    </Tooltip>
                );
            }}
        />
    );
});
export const CancelMenuItem = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <MenuItem 
                        disabled={isMutating}
                        className={styles.redIconMenuItem}
                        icon={<DismissRegular />} 
                        onClick={() => { field.handleChange("CONFIRM_CANCEL"); }}
                    >
                        {t('Cancel')}
                    </MenuItem>
                );
            }}
        />
    );
};