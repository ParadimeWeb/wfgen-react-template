import { Text, Field, Menu, MenuButton, MenuDivider, MenuGroup, MenuGroupHeader, MenuItem, MenuList, MenuPopover, MenuTrigger, ToolbarButton, Input, Tooltip } from "@fluentui/react-components";
import { ArrowSyncRegular, DismissRegular, PrintRegular } from "@fluentui/react-icons";
import { useWfgFormContext } from "../Form/Provider";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

const PrintViewToolbarButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const { printForm: form } = useWfgFormContext();

    return (
        <ToolbarButton
            ref={ref}
            icon={<PrintRegular />} 
            onClick={() => { form.setFieldValue('open', true); }}
        >
            {t('Print View')}
        </ToolbarButton>
    );
});
const PrintViewToolbarIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>((_, ref) => {
    const { t } = useTranslation();
    const { printForm: form } = useWfgFormContext();

    return (
        <Tooltip content={t('Print View')} relationship="label" positioning="below">
            <ToolbarButton
                ref={ref}
                icon={<PrintRegular />} 
                onClick={() => { form.setFieldValue('open', true); }}
            />
        </Tooltip>
    );
});
const PrintViewMenu = () => {
    const { t } = useTranslation();
    const { printForm: form } = useWfgFormContext();
    const { printPageWidthFormatted } = form.state.values;

    return <Menu>
        <MenuTrigger>
            <MenuButton appearance="subtle" icon={<PrintRegular />}>{t('Print View')}</MenuButton>
        </MenuTrigger>
        <MenuPopover>
            <MenuList>
                <MenuGroup>
                    <MenuGroupHeader>{t('Page width')}</MenuGroupHeader>
                    <form.Field 
                        name="printPageWidthFormatted"
                        children={(field) => {
                            return (
                                <Field
                                    required
                                    validationMessage={field.state.meta.isTouched && field.state.meta.errors.length ? field.state.meta.errors.join(', ') : null}
                                >
                                    <Input
                                        value={field.state.value}
                                        onChange={(_, { value }) => { field.handleChange(value); }}
                                        contentAfter={<Text size={400}>{t('in')}</Text>}
                                    />
                                </Field>
                            );
                        }}
                    />
                    <form.Subscribe 
                        selector={(state) => [state.canSubmit, state.values.printPageWidthFormatted]}
                        children={([_, newPrintPageWidthFormatted]) => <MenuItem disabled={printPageWidthFormatted === newPrintPageWidthFormatted} icon={<ArrowSyncRegular />} onClick={() => { form.handleSubmit(); }}>{t('Refresh')}</MenuItem>}
                    />
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                    <MenuGroupHeader>{t('Actions')}</MenuGroupHeader>
                    <MenuItem icon={<PrintRegular />} onClick={() => { window.print(); }}>{t('Print')}</MenuItem>
                    <MenuItem icon={<DismissRegular />} onClick={() => { form.setFieldValue('open', false); }}>{t('Close print view')}</MenuItem>
                </MenuGroup>
            </MenuList>
        </MenuPopover>
    </Menu>;
};

export const PrintViewButton = () => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintViewMenu /> : <PrintViewToolbarButton />;
};
export const PrintViewIconButton = () => {
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    return isPrintView ? <PrintViewMenu /> : <PrintViewToolbarIconButton />;
};

export const PrintViewMenuItem = () => {
    const { t } = useTranslation();
    const { printForm: form } = useWfgFormContext();

    return (
        <MenuItem
            icon={<PrintRegular />} 
            onClick={() => { form.setFieldValue('open', true); }}
        >
            {t('Print View')}
        </MenuItem>
    );
};