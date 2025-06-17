import { Menu, MenuList, MenuPopover, MenuTrigger, ToolbarButton, useOverflowMenu } from "@fluentui/react-components";
import { MoreHorizontalRegular } from "@fluentui/react-icons";
import { OverflowMenuItem } from "@wfgen/components/CommandsToolbar/OverflowMenuItem";

type OverflowMenuProps = {
    toolbar: "items" | "faritems"
    commands: string[]
};
export const OverflowMenu = (props: OverflowMenuProps) => {
    const { toolbar, commands } = props;
    const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

    if (!isOverflowing) {
        return null;
    }

    return <Menu hasIcons>
        <MenuTrigger>
            <ToolbarButton ref={ref} icon={<MoreHorizontalRegular />} aria-label={`${overflowCount} buttons`} />
        </MenuTrigger>
        <MenuPopover>
            <MenuList>
                {commands.map((command, index) => (
                    <OverflowMenuItem key={`item-${index}`} id={`${toolbar}_${index}_${command}`} />
                ))}
            </MenuList>
        </MenuPopover>
    </Menu>;
}