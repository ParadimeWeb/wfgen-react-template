import { Avatar, Tag} from "@fluentui/react-components";
import type { User } from "@wfgen/types";
import { directoryColors } from "@wfgen/utils";
import type { TagComponentProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";

export const UserTag = (props: TagComponentProps) => {
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