import { MenuItem, useIsOverflowItemVisible } from "@fluentui/react-components";
import commands from "../Commands";
import { QuestionCircleRegular } from "@fluentui/react-icons";

type OverflowMenuItemProps = {
    id: string;
};
export const OverflowMenuItem = (props: OverflowMenuItemProps) => {
    const { id } = props;
    const command = id.split('_')[2];
    const isVisible = useIsOverflowItemVisible(id);
    
    if (isVisible) {
        return null;
    }

    const menuItem = commands.get(command)?.menuItem;
    return menuItem ? menuItem() : <MenuItem disabled icon={<QuestionCircleRegular />}>{command}</MenuItem>;
}