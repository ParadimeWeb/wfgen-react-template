import { FluentProvider, makeStyles, mergeClasses, Spinner } from "@fluentui/react-components";
import { formStyles } from "../styles";
import { useDarkMode, useReadLocalStorage } from "usehooks-ts";
import { darkTheme, lightTheme } from "./ThemeProvider";

const useStyles = makeStyles({
    ...formStyles
});
export const PendingComponent = () => {
    const styles = useStyles();
    const { isDarkMode } = useDarkMode();
    const wfgTheme = useReadLocalStorage<string>('wfgen:theme', { deserializer: v => v });
    const theme = wfgTheme ? wfgTheme.includes('dark') ? darkTheme : lightTheme : isDarkMode ? darkTheme : lightTheme;
    return (
        <FluentProvider theme={theme} className={mergeClasses(styles.container, styles.width)}>
            <Spinner />
        </FluentProvider>
    );
}