import { Avatar, Tag, TagPickerGroup} from "@fluentui/react-components";
import type { User } from "../../../../types";
import { directoryColors } from "../../../../utils";
import type { RowTagProps } from "../types";

export const UserTagPickerGroup = ({ rows }: Pick<RowTagProps, 'rows'>) => {
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