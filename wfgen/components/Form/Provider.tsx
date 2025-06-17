import type { WfgFormContext } from "@wfgen/types";
import ThemeProvider from "@wfgen/components/ThemeProvider";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { formStyles } from "@wfgen/styles";
import { FormActionDialog } from "@wfgen/components/Dialogs/FormAction";
import { FormActionDrawer } from "@wfgen/components/Drawers/FormAction";
import { FormContext, useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { AutoSaveToast } from "../AutoSaveToast";

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
            {autoSaveInterval > 0 ? <AutoSaveToast autoSaveInterval={autoSaveInterval} /> : null}
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