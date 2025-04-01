import { MenuItem, ToolbarButton } from "@fluentui/react-components";
import { QuestionCircleRegular } from "@fluentui/react-icons";
import { forwardRef } from "react";

export const UnknownButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, { command: string }>(({ command }, ref) => {
    return <ToolbarButton ref={ref} disabled icon={<QuestionCircleRegular />}>{command}</ToolbarButton>
});
export const UnknownMenuItem = ({ command }: { command: string }) => {
    return <MenuItem disabled icon={<QuestionCircleRegular />}>{command}</MenuItem>;
};