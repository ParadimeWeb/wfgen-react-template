import { type GriffelStyle, tokens } from '@fluentui/react-components';

export const headerHeight = 40;
export const footerHeight = 31;

export const formStyles: { 
    width: GriffelStyle; 
    container: GriffelStyle; 
} = {
    width: {
        width: '960px',
        '@media (max-width: 980px)': {
            width: '100%'
        }
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: tokens.spacingVerticalS,
        margin: '0 auto',
        minHeight: '100vh'
    }
};

export const fieldStyles: {
    cursorReadonly: GriffelStyle;
    cursorPointer: GriffelStyle;
} = {
    cursorReadonly: {
        cursor: 'default !important'
    },
    cursorPointer: {
        cursor: 'pointer !important'
    }
};

export const styleHelpers = {
    flex: (): GriffelStyle => ({
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: 'auto',
        height: 'auto',
        boxSizing: 'border-box'
    }),
    colSpan: (span: string | number): GriffelStyle => ({
        gridColumnStart: `span ${span}`,
        gridColumnEnd: `span ${span}`
    }),
    row: (colSpan: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' = 'auto', responsive: boolean = true): GriffelStyle => {
        const styles: GriffelStyle = {
            display: 'grid',
            padding: `0 ${tokens.spacingHorizontalS}`,
            gridTemplateColumns: colSpan === 'auto' || responsive ? 'repeat(1, minmax(0, 1fr))' : `repeat(${colSpan}, minmax(0, 1fr))`,
            columnGap: tokens.spacingHorizontalS,
            alignItems: 'flex-start'
        };
        if (responsive) {
            if (colSpan === 'auto') {
                return {
                    ...styles,
                    '@media (min-width: 640px)': {
                        gridAutoFlow: 'column',
                        gridAutoColumns: 'minmax(0, 1fr)'
                    }
                };
            }
            return {
                ...styles,
                '@media (min-width: 640px)': {
                    gridTemplateColumns: `repeat(${colSpan}, minmax(0, 1fr))`
                }
            };
        }
        if (colSpan === 'auto') {
            return {
                ...styles,
                gridAutoFlow: 'column',
                gridAutoColumns: 'minmax(0, 1fr)'
            };
        }
        return styles;
    }
};