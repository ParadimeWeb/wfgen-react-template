import { CounterBadge, makeStyles, MenuItem, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { ApprovalsAppRegular } from "@fluentui/react-icons";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "../Form/Provider";

const useStyles = makeStyles({
    badgeButton: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export const ApprovalsButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Approvals?.length ?? 0}
                        children={count => {
                            return (
                                <ToolbarButton 
                                    ref={ref}
                                    className={styles.badgeButton}
                                    icon={<><ApprovalsAppRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                    onClick={() => { field.handleChange('DRAWER_APPROVALS'); }}
                                >
                                    {t('Approvals')}
                                </ToolbarButton>
                            );
                        }}
                    />
                );
            }}
        />
    );
});
export const ApprovalsIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Approvals?.length ?? 0}
                        children={count => {
                            return (
                                <Tooltip content={t('Approvals')} relationship="label" positioning="below">
                                    <ToolbarButton 
                                        ref={ref}
                                        className={styles.badgeButton}
                                        icon={<><ApprovalsAppRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                        onClick={() => { field.handleChange('DRAWER_APPROVALS'); }}
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
export const ApprovalsMenuItem = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Approvals?.length ?? 0}
                        children={count => {
                            return (
                                <MenuItem 
                                    icon={<><ApprovalsAppRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                    onClick={() => { field.handleChange('DRAWER_APPROVALS'); }}
                                >
                                    {t('Approvals')}
                                </MenuItem>
                            );
                        }}
                    />
                );
            }}
        />
    );
};