import { makeStyles, MenuItem, tokens, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { ShieldTaskRegular } from "@fluentui/react-icons";
import { useIsMutating } from "@tanstack/react-query";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";

const useStyles = makeStyles({
    greenIconButton: {
        '& .fui-Button__icon': {
            color: tokens.colorPaletteGreenForeground1
        },
        ':hover .fui-Button__icon': {
            color: tokens.colorPaletteGreenForeground2
        },
        ':hover:active .fui-Button__icon': {
            color: tokens.colorPaletteGreenForeground3
        }
    },
    greenIconMenuItem: {
        '& .fui-MenuItem__icon': {
            color: tokens.colorPaletteGreenForeground1
        },
        ':hover .fui-MenuItem__icon': {
            color: tokens.colorPaletteGreenForeground2
        },
        ':hover:active .fui-MenuItem__icon': {
            color: tokens.colorPaletteGreenForeground3
        }
    }
});

export const ApproveButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
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
                        className={styles.greenIconButton}
                        icon={<ShieldTaskRegular />}
                        onClick={() => { field.handleChange('CONFIRM_APPROVE'); }}
                    >
                        {t('Approve')}
                    </ToolbarButton>
                );
            }}
        />
    );
});
export const ApproveIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const isMutating = useIsMutating({ mutationKey: ['save'], exact: true }) > 0;
    return isMutating ? (
        <ToolbarButton 
            disabled
            ref={ref}
            icon={<ShieldTaskRegular />}
        />
    ) : (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <Tooltip 
                        withArrow
                        content={t('Approve')}
                        relationship="label"
                        positioning="below"
                    >
                        <ToolbarButton
                            ref={ref}
                            className={styles.greenIconButton}
                            icon={<ShieldTaskRegular />}
                            onClick={() => { field.handleChange('CONFIRM_APPROVE'); }}
                        />
                    </Tooltip>
                );
            }}
        />
    );
});
export const ApproveMenuItem = () => {
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
                        className={styles.greenIconMenuItem}
                        icon={<ShieldTaskRegular />} 
                        onClick={() => { field.handleChange("CONFIRM_APPROVE"); }}
                    >
                        {t('Approve')}
                    </MenuItem>
                );
            }}
        />
    );
};