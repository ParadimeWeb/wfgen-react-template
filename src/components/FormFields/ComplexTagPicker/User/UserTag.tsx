import { Avatar, Tag} from "@fluentui/react-components";
import type { User } from "../../../../types";
import { directoryColors } from "../../../../utils";
import type { RowTagProps } from "../types";

export const UserTag = (props: Omit<RowTagProps, 'rows'>) => {
    const { row, fieldProps, tagProps } = props;
    const user = row as User;
    return (
        <Tag
            size={fieldProps?.size === "large" ? "medium" : fieldProps?.size === "small" ? "extra-small" : "small"}
            media={
                <Avatar
                    aria-hidden
                    name={user.CommonName!}
                    color={directoryColors.get(user.Directory!)}
                />
            }
            {...tagProps}
        >
            {user.CommonName}
        </Tag>
    );
};