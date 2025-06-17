import { Avatar, TagPickerOption } from "@fluentui/react-components";
import type { User } from "@wfgen/types";
import { directoryColors } from "@wfgen/utils";
import type { TagPickerOptionComponentProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";


export const UserTagPickerOption = ({ row, rows }: TagPickerOptionComponentProps) => {
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