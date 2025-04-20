import { FluentProvider, makeStyles, tokens, Skeleton, SkeletonItem } from '@fluentui/react-components';
import { useDarkMode, useReadLocalStorage } from 'usehooks-ts';
import { darkTheme, lightTheme } from '../ThemeProvider';
import { footerHeight } from './Footer';
import { headerHeight } from './Header';

const useStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorNeutralBackground2,
        '> div': {
            width: '960px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            rowGap: tokens.spacingHorizontalS,
            margin: '0 auto',
            '& header, & main, & footer': {
                backgroundColor: tokens.colorNeutralBackground1,
                boxShadow: tokens.shadow4
            },
            '& header > div, & main > div, & footer > div': {
                display: 'grid',
                columnGap: tokens.spacingHorizontalL
            },
            '& header > div, & footer > div': {
                alignItems: 'center',
                padding: `0 ${tokens.spacingHorizontalS}`
            },
            '& footer > div': {
                justifyContent: 'space-between',
                gridTemplateColumns: '250px 200px 175px',
                height: `${footerHeight}px`
            },
            '& header > div': {
                gridTemplateColumns: '150px 150px 1fr 30px',
                height: `${headerHeight}px`
            },
            '& main': {
                flexGrow: 1,
                padding: tokens.spacingHorizontalS,
                '> div': {
                    gridTemplateColumns: 'auto auto',
                    '> div': {
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: tokens.spacingVerticalXS
                    }
                }
            },
            '@media (max-width: 980px)': {
                width: '100%'
            }
        }
    },
    label1: { width: '150px' },
    label2: { width: '200px' },
    label3: { width: '250px' }
});

export const FormSkeleton = () => {
    const styles = useStyles();
    const { isDarkMode } = useDarkMode();
    const wfgTheme = useReadLocalStorage<string>('wfgen:theme', { deserializer: v => v });
    const theme = wfgTheme ? wfgTheme.includes('dark') ? darkTheme : lightTheme : isDarkMode ? darkTheme : lightTheme;

    return (
        <FluentProvider theme={theme} className={styles.root}>
            <Skeleton>
                <header>
                    <div>
                        <SkeletonItem size={24} />
                        <SkeletonItem size={24} />
                        <div />
                        <SkeletonItem size={24} />
                    </div>
                </header>
                <main>
                    <div>
                        <div>
                            <SkeletonItem size={16} className={styles.label2} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label3} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label1} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label2} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label3} />
                            <SkeletonItem size={32} />
                        </div>
                        <div>
                            <SkeletonItem size={16} className={styles.label3} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label1} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label2} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label3} />
                            <SkeletonItem size={32} />
                            <SkeletonItem size={16} className={styles.label1} />
                            <SkeletonItem size={32} />
                        </div>
                    </div>
                </main>
                <footer>
                    <div>
                        <SkeletonItem size={8} />
                        <SkeletonItem size={8} />
                        <SkeletonItem size={8} />
                    </div>
                </footer>
            </Skeleton>
        </FluentProvider>
    );
};