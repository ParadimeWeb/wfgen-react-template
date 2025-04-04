import { Avatar, TagPickerOption } from "@fluentui/react-components";
import type { User } from "../../../../types";
import { directoryColors } from "../../../../utils";
import type { RowTagProps } from "../types";


export const UserTagPickerOption = ({ row, rows }: Pick<RowTagProps, 'row' | 'rows'>) => {
    const { CommonName, JobTitle, Directory, UserName } = row as User;
    const selected = rows.find(r => r.UserName === UserName);
    return (
        <TagPickerOption
            secondaryContent={JobTitle}
            media={<Avatar shape="square" aria-hidden name={CommonName!} color={directoryColors.get(Directory!)} active={selected ? 'active' : 'unset'} />}
            value={selected ? `selected-${UserName}` : UserName!}
        >
            {CommonName!}
        </TagPickerOption>
    );
};