import { Divider, makeStyles, tokens, mergeClasses, type DividerProps } from '@fluentui/react-components';

const useStyles = makeStyles({
    divider: {
        padding: '40px 0 10px',
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase500,
        fontWeight: tokens.fontWeightSemibold,
        lineHeight: tokens.lineHeightBase500
    },
    noTopPadding: {
        paddingTop: 0
    },
    noBottomPadding: {
        paddingBottom: 0
    }
});
type SectionDividerProps = {
    noTopPadding?: boolean
    noBottomPadding?: boolean
} & DividerProps;

export const SectionDivider = (props: SectionDividerProps) => {
    const { noTopPadding = false, noBottomPadding = false, ...dividerProps } = props;
    const styles = useStyles();

    return (
        <Divider 
            alignContent="start"
            {...dividerProps} 
            className={mergeClasses(styles.divider, noTopPadding && styles.noTopPadding, noBottomPadding && styles.noBottomPadding, props.className)}
        />
    );
}