import { createDarkTheme, createLightTheme, FluentProvider, makeStyles, tokens, type BrandVariants } from "@fluentui/react-components";
import { useDarkMode, useReadLocalStorage } from "usehooks-ts";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";

const centric: BrandVariants = { 
    10: "#020304",
    20: "#14171C",
    30: "#1E2530",
    40: "#28313E",
    50: "#353D4A",
    60: "#424A56",
    70: "#505762",
    80: "#5D646E",
    90: "#6B717B",
    100: "#7A7F88",
    110: "#888D95",
    120: "#979BA2",
    130: "#A6AAB0",
    140: "#B6B9BE",
    150: "#C5C8CC",
    160: "#D5D7DA"
};
    
export const darkTheme = {
    ...createDarkTheme(centric),
    colorBrandForeground1: centric[110],
    colorBrandForeground2: centric[120],
    headerBackgroundColor: 'rgba(41, 41, 41, 0.7)',
    uploadBackgroundImage: `url("data:image/svg+xml,%3Csvg width='32px' height='32px' fill='%23ffffff' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.5 2H5.74C4.78 2 4 2.78 4 3.75v10.5c0 .97.78 1.75 1.75 1.75h3.46c-.1-.32-.16-.66-.19-1H5.75a.75.75 0 01-.75-.75V3.75c0-.41.34-.75.75-.75H10v3.5c0 .83.67 1.5 1.5 1.5H15v1.02c.34.03.68.1 1 .19V7.5v-.02c-.01-.45-.2-.88-.51-1.2l-3.77-3.77A1.75 1.75 0 0010.5 2zm.5 1.2l.01.02 3.77 3.77.01.01H11.5a.5.5 0 01-.5-.5V3.2zM5.5 17h4.1c.18.36.4.7.66 1H5.5A3.5 3.5 0 012 14.5v-1a.5.5 0 011 0v1A2.5 2.5 0 005.5 17zM6 5.5c0-.28.22-.5.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6.5 7a.5.5 0 000 1h2a.5.5 0 000-1h-2zm0 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM19 14.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-4-2a.5.5 0 00-1 0V14h-1.5a.5.5 0 000 1H14v1.5a.5.5 0 001 0V15h1.5a.5.5 0 000-1H15v-1.5z'%3E%3C/path%3E%3C/svg%3E")`
};
export const lightTheme = {
    ...createLightTheme(centric),
    headerBackgroundColor: 'rgba(255, 255, 255, 0.7)',
    uploadBackgroundImage: `url("data:image/svg+xml,%3Csvg width='32px' height='32px' fill='%23242424' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.5 2H5.74C4.78 2 4 2.78 4 3.75v10.5c0 .97.78 1.75 1.75 1.75h3.46c-.1-.32-.16-.66-.19-1H5.75a.75.75 0 01-.75-.75V3.75c0-.41.34-.75.75-.75H10v3.5c0 .83.67 1.5 1.5 1.5H15v1.02c.34.03.68.1 1 .19V7.5v-.02c-.01-.45-.2-.88-.51-1.2l-3.77-3.77A1.75 1.75 0 0010.5 2zm.5 1.2l.01.02 3.77 3.77.01.01H11.5a.5.5 0 01-.5-.5V3.2zM5.5 17h4.1c.18.36.4.7.66 1H5.5A3.5 3.5 0 012 14.5v-1a.5.5 0 011 0v1A2.5 2.5 0 005.5 17zM6 5.5c0-.28.22-.5.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6.5 7a.5.5 0 000 1h2a.5.5 0 000-1h-2zm0 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM19 14.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-4-2a.5.5 0 00-1 0V14h-1.5a.5.5 0 000 1H14v1.5a.5.5 0 001 0V15h1.5a.5.5 0 000-1H15v-1.5z'%3E%3C/path%3E%3C/svg%3E")`
};

const useStyles = makeStyles({
    bgColor: {
        backgroundColor: tokens.colorNeutralBackground2
    }
});
export default ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    const { isDarkMode } = useDarkMode();
    const wfgTheme = useReadLocalStorage<string>('wfgen:theme', { deserializer: v => v });
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const theme = isPrintView ? lightTheme : (wfgTheme ? wfgTheme.includes('dark') ? darkTheme : lightTheme : isDarkMode ? darkTheme : lightTheme);

    return (
        <FluentProvider theme={theme} className={styles.bgColor}>
            {children}
        </FluentProvider>
    );
}