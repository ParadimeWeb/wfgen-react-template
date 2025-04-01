import { Caption1, Caption2, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { formStyles } from "../../styles";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";
import { useWfgFormContext } from "./Provider";

export const footerHeight = 31;

const useStyles = makeStyles({
    ...formStyles,
    footer: {
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'var(--headerBackgroundColor)',
        backdropFilter: 'blur(8px)',
        '-webkit-backdrop-filter': 'blur(8px)',
        boxShadow: tokens.shadow4,
        flexShrink: 0
    },
    footerContent: {
        height: `${footerHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    footerInfo: {
        display: 'flex',
        flexWrap: 'nowrap',
        width: 'auto',
        height: 'auto',
        boxSizing: 'border-box',
        flexDirection: 'row',
        padding: '4px 8px 2px',
        justifyContent: 'space-between',
        alignItems: 'center',
        '> div': {
            overflow: 'hidden'
        }
    },
    colorNeutralForeground4: {
        color: tokens.colorNeutralForeground4
    },
    colorBrandForeground1: {
        color: tokens.colorBrandForeground1
    }
});
export type FormFooterProps = {
    className?: string;
};
export const FormFooter = ({ className }: FormFooterProps) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { configuration, timeZoneInfo } = useFormInitQuery();
    
    if (isPrintView) {
        return null;
    }
    return (
        <footer className={mergeClasses('wfg-footer', styles.footer, className)}>
            <div className={mergeClasses('wfg-footer-content', styles.footerContent, styles.width)}>
                <div className={styles.footerInfo}>
                    <div>
                        <Caption1 
                            truncate 
                            block
                            wrap={false}
                            className={styles.colorBrandForeground1}
                        >
                            {`${t(`{{activityInstId}}-${configuration.WF_ACTIVITY_NAME}`, { 
                                activityInstId: configuration.WF_ACTIVITY_INST_ID 
                            })} `}
                            <Caption2 
                                wrap={false}
                                className={styles.colorNeutralForeground4}
                            >
                                {t(`{{processInstId}}-${configuration.WF_PROCESS_NAME} v{{version}}`, { 
                                    processInstId: configuration.WF_PROCESS_INST_ID, 
                                    version: configuration.WF_PROCESS_VERSION 
                                })}
                            </Caption2>
                        </Caption1>
                    </div>
                    <div>
                        <Caption2 
                            truncate 
                            block
                            wrap={false}
                            className={styles.colorNeutralForeground4}
                        >
                            {timeZoneInfo.Name}
                        </Caption2>
                    </div>
                    <div>
                        <Caption1 
                            truncate 
                            block
                            wrap={false}
                            className={styles.colorNeutralForeground4}
                        >
                            {`\u00A9 ${t('Company Name')}`}
                        </Caption1>
                    </div>
                </div>
            </div>
        </footer>
    );
}