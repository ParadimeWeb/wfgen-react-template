import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { formStyles } from "../../styles";
import { CommandsToolbar } from "../CommandsToolbar";
import { printPageMargin, useWfgFormContext } from "./Provider";
import { ValidationErrorsMessageBar } from "../ValidationErrorsMessageBar";

export const headerHeight = 40;

type FormHeaderProps = {
    children?: React.ReactNode;
    className?: string;
};

const useStyles = makeStyles({
    ...formStyles,
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'var(--headerBackgroundColor)',
        backdropFilter: 'blur(8px)',
        '-webkit-backdrop-filter': 'blur(8px)',
        boxShadow: tokens.shadow4,
        flexShrink: 0,
        '@media print': {
            display: 'none'
        }
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
});

const PrintView = (props: FormHeaderProps) => {
    const { className } = props;
    const { printForm: { state: { values: { printPageWidth } } } } = useWfgFormContext();
    const styles = useStyles();

    return (
        <header className={mergeClasses('wfg-header', styles.header, className)}>
            <div className={mergeClasses('wfg-header-content', styles.headerContent)} style={{ width: `${printPageWidth - printPageMargin - printPageMargin}in` }}>
                <CommandsToolbar />
            </div>
        </header>
    );
};
const View = (props: FormHeaderProps) => {
    const { className, children } = props;
    const styles = useStyles();

    return <header className={mergeClasses('wfg-header', styles.header, className)}>
        <div className={mergeClasses('wfg-header-content', styles.headerContent, styles.width)}>
            <CommandsToolbar />
            {children}
            <ValidationErrorsMessageBar />
        </div>
    </header>;
};
export const FormHeader = (props: FormHeaderProps) => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintView {...props} /> : <View {...props} />;
};