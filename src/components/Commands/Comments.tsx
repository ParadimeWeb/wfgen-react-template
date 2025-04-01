import { CounterBadge, makeStyles, MenuItem, ToolbarButton, Tooltip } from "@fluentui/react-components";
import { CommentMultipleRegular } from "@fluentui/react-icons";
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

export const CommentsButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Comments.length}
                        children={count => {
                            return (
                                <ToolbarButton 
                                    ref={ref}
                                    className={styles.badgeButton}
                                    icon={<><CommentMultipleRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                    onClick={() => { field.handleChange('DRAWER_COMMENTS'); }}
                                >
                                    {t('Comments')}
                                </ToolbarButton>
                            );
                        }}
                    />
                );
            }}
        />
    );
});
export const CommentsIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Comments.length}
                        children={count => {
                            return (
                                <Tooltip content={t('Comments')} relationship="label" positioning="below">
                                    <ToolbarButton 
                                        ref={ref}
                                        className={styles.badgeButton}
                                        icon={<><CommentMultipleRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                        onClick={() => { field.handleChange('DRAWER_COMMENTS'); }}
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
export const CommentsMenuItem = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { form } = useWfgFormContext();

    return (
        <form.Field 
            name="Table1[0].FORM_ACTION"
            children={field => {
                return (
                    <form.Subscribe 
                        selector={s => s.values.__Comments.length}
                        children={count => {
                            return (
                                <MenuItem 
                                    icon={<><CommentMultipleRegular /><CounterBadge className={styles.badge} size="small" count={count} /></>}
                                    onClick={() => { field.handleChange('DRAWER_COMMENTS'); }}
                                >
                                    {t('Comments')}
                                </MenuItem>
                            );
                        }}
                    />
                );
            }}
        />
    );
};