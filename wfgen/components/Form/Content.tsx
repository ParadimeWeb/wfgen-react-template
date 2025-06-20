import { Caption1, Caption2, Divider, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";

const useStyles = makeStyles({
    main: {
        backgroundColor: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow4,
        flexGrow: 1,
        paddingBottom: tokens.spacingVerticalXXL,
        '@media print': {
            boxShadow: 'none'
        }
    },
    colorNeutralForeground4: {
        color: tokens.colorNeutralForeground4
    }
});
type FormContentProps = {
    children: React.ReactNode
    className?: string
    printProps?: {
        showComments?: boolean
        showApprovals?: boolean
    }
};

const PrintView = (props: FormContentProps) => {
    const {
        children,
        className,
        printProps = {
            showApprovals: false,
            showComments: false
        }
    } = props;
    const { showApprovals = false, showComments = false } = printProps;
    const styles = useStyles();
    const { t } = useTranslation();
    const { configuration, currentUser, timeZoneInfo, isArchive } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const { state: { values: { __Comments: comments, __Approvals: approvals = [] } } } = form;

    return (
        <main className={mergeClasses('wfg-main', styles.main, className)}>
            {children}
            {showApprovals && approvals.length > 0 ?
            <form.AppField 
                name="__Approvals"
                children={field => <><Divider>Approvals</Divider><field.Approvals /></>}
            /> 
            : null}
            {showComments && comments.length > 0 ?
            <form.AppField 
                name="__Comments"
                children={(field) => <><Divider>Comments</Divider><field.Comments /></>}
            />
            : null}
            <div>
                <Divider alignContent="end">
                    <Caption1 className={styles.colorNeutralForeground4}>
                        {t('Modified by {{name}} ({{userName}}) on {{date}}', { 
                            name: currentUser.CommonName, 
                            userName: currentUser.UserName, 
                            date: isArchive ? dayjs(configuration.WF_MODIFIED).utcOffset(timeZoneInfo.UTCOffset).format('l LT') : dayjs().utcOffset(timeZoneInfo.UTCOffset).format('l LT') 
                        })}
                    </Caption1>
                </Divider>
                <Divider alignContent="end">
                    <Caption2 className={styles.colorNeutralForeground4}>{timeZoneInfo.Name}</Caption2>
                </Divider>
            </div>
        </main>
    );
};
const View = (props: FormContentProps) => {
    const {
        children,
        className
    } = props;
    const styles = useStyles();

    return (
        <main className={mergeClasses('wfg-main', styles.main, className)}>
            {children}
        </main>
    );
};

export const FormContent = (props: FormContentProps) => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
};