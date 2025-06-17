import { Avatar, Tag, TagPickerGroup } from "@fluentui/react-components";
import type { User } from "@wfgen/types";
import { directoryColors } from "@wfgen/utils";
import type { TagPickerGroupComponentProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";

export const UserTagPickerGroup = ({ rows }: TagPickerGroupComponentProps) => {
    return (
        <TagPickerGroup aria-label="Selected Employees">
            {rows.map((row, i) => {
                const { CommonName, UserName, Directory } = row as User;
                return (
                    <Tag
                        key={`tag-${i}`}
                        media={
                            <Avatar
                                aria-hidden
                                name={CommonName!}
                                color={directoryColors.get(Directory!)}
                            />
                        }
                        value={UserName!}
                    >
                        {CommonName}
                    </Tag>
                );
            })}
        </TagPickerGroup>
    );
};