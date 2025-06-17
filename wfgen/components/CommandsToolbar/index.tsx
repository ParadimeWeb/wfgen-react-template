import { makeStyles, Menu, MenuList, MenuPopover, MenuTrigger, Overflow, OverflowItem, Toolbar, ToolbarButton, ToolbarGroup } from "@fluentui/react-components";
import { OverflowMenu } from "@wfgen/components/CommandsToolbar/OverflowMenu";
import commandsMap from "@wfgen/components/Commands";
import { useFormInitQuery } from "@wfgen/hooks/useFormInitQuery";
import { NavigationRegular } from "@fluentui/react-icons";
import { Fragment } from "react/jsx-runtime";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import { UnknownButton, UnknownMenuItem } from "@wfgen/components/Commands/Unknown";

const useStyles = makeStyles({
    toolbar: {
        flexGrow: 1
    },
    items: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'nowrap'
    },
    farItems: {
        display: 'flex',
        flexWrap: 'nowrap'
    }
});

export const CommandsToolbar = () => {
    const styles = useStyles();
    const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { commands } = useFormInitQuery();
    if (commands.MAIN.length < 1 && commands.FAR.length < 1 && commands.MORE.length < 1) {
        return null;
    }
    const itemsCommand = Array.from(commands.MAIN);
    return (
        <Toolbar className={styles.toolbar}>
            <Overflow minimumVisible={2}>
                <ToolbarGroup className={styles.items}>
                    {isPrintView === false ? <>
                    {itemsCommand.map((command, index) => (
                        <OverflowItem key={`item-${index}`} id={`items_${index}_${command}`}>
                            {commandsMap.get(command)?.button() ?? <UnknownButton command={command} />}
                        </OverflowItem>
                    ))}
                    <OverflowMenu toolbar="items" commands={itemsCommand} />
                    </> : null}
                </ToolbarGroup>
            </Overflow>
            <ToolbarGroup className={styles.farItems}>
                {isPrintView ?
                    commandsMap.get('PRINT')?.button() ?? <UnknownButton command="PRINT" />
                : <>
                    {commands.FAR.length > 0 ? Array.from(commands.FAR).map((command, index) => (
                        <Fragment key={`far-${index}`}>{commandsMap.get(command)?.button() ?? <UnknownButton command={command} />}</Fragment>
                    )) : null}
                    {commands.MORE.length > 0 ?
                    <Menu hasIcons>
                        <MenuTrigger>
                            <ToolbarButton icon={<NavigationRegular />} />
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                {Array.from(commands.MORE).map((command, index) => {
                                    const comm = commandsMap.get(command);
                                    const menuItem = comm && comm.menuItem ? comm.menuItem() : <UnknownMenuItem command={command} />;
                                    return <Fragment key={`more-${index}`}>{menuItem}</Fragment>;
                                })}
                            </MenuList>
                        </MenuPopover>
                    </Menu> : null}
                </>}
            </ToolbarGroup>
        </Toolbar>
    );
};
