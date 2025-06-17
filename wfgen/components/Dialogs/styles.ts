import { shorthands, tokens, type GriffelStyle, type Theme } from "@fluentui/react-components";

export const redTheme: Partial<Theme> = {
    colorCompoundBrandStroke: tokens.colorPaletteRedForeground1,
    colorCompoundBrandStrokePressed: tokens.colorPaletteRedForeground2,
    colorBrandStroke1: tokens.colorPaletteRedBorder2,
    colorBrandStroke2Contrast: tokens.colorPaletteRedBorder1,
    colorBrandBackground: tokens.colorPaletteRedForeground3,
    colorBrandBackgroundHover: tokens.colorPaletteRedForeground1,
    colorBrandBackgroundPressed: tokens.colorPaletteRedForeground2,
    colorBrandForeground1: tokens.colorPaletteRedForeground1
};

export const dialogStyles: { 
    primary: GriffelStyle; 
    top: GriffelStyle 
} = {
    primary: {
        borderTopColor: tokens.colorBrandStroke1,
        ...shorthands.borderWidth('4px', 0, 0)
    },
    top: {
        marginTop: '40px',
        maxHeight: 'calc(-40px + 100vh)',
        '& > .fui-DialogBody': {
            maxHeight: 'calc(-88px + 100vh)'
        }
    }
};