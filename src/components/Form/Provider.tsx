import { createContext, useContext } from "react";
import type { WfgFormContext } from "../../types";
import ThemeProvider from "../ThemeProvider";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { formStyles } from "../../styles";
import { FormActionDialog } from "../Dialogs/FormAction";
import { FormActionDrawer } from "../Drawers/FormAction";

const FormContext = createContext<WfgFormContext | null>(null);
export const useWfgFormContext = () => useContext(FormContext)!;
export const printPageMargin = 0.25;

type WfgFormProviderProps = {
    children: React.ReactNode
    ctx: WfgFormContext
    className?: string
    autoSaveInterval?: number
};
type FormProps = Omit<WfgFormProviderProps, 'ctx'>;

const useStyles = makeStyles({
    ...formStyles
});

const PrintView = (props: FormProps) => {
    const {
        children,
        className
    } = props;
    const { printForm } = useWfgFormContext();
    const styles = useStyles();

    return (
        <printForm.Subscribe 
            selector={s => s.values.printPageWidth}
            children={printPageWidth => (
                <div className={mergeClasses('wfg-container', styles.container, className)} style={{ width: `${printPageWidth - printPageMargin - printPageMargin}in` }}>
                    {children}
                </div>
            )}
        />
    );
};
const View = (props: FormProps) => {
    const styles = useStyles();
    const {
        children,
        className,
        autoSaveInterval = 0
    } = props;

    return (
        <div className={mergeClasses('wfg-container', styles.container, styles.width, className)}>
            {children}
            <FormActionDialog />
            <FormActionDrawer />
        </div>
    );
};

export const WfgFormProvider = (props: WfgFormProviderProps) => {
    const { ctx, ...formProps } = props;
    return (
        <FormContext.Provider value={ctx}>
            <ctx.printForm.Subscribe 
                selector={s => s.values.open}
                children={isPrintView => {
                    return (
                        <ctx.form.AppForm>
                            <ThemeProvider>
                                {isPrintView ? <PrintView {...formProps} /> : <View {...formProps} />}
                            </ThemeProvider>
                        </ctx.form.AppForm>
                    );
                }}
            />
        </FormContext.Provider>
    );
};