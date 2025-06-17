import { Avatar, Tag, TagPickerGroup, TagPickerOption } from "@fluentui/react-components";
import type { FilterRowsProps, TagComponentProps, TagPickerGroupComponentProps, TagPickerOptionComponentProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";
import { BriefcaseRegular } from "@fluentui/react-icons";

export function ValueTextTag(props: TagComponentProps) {
    const { fieldProps, tagProps, row, valueKey = "Value", textKey = "Text" } = props;
    return (
        <Tag
            size={fieldProps?.size === "large" ? "medium" : fieldProps?.size === "small" ? "extra-small" : "small"}
            media={
                <Avatar
                    aria-hidden
                    icon={<BriefcaseRegular />}
                />
            }
            {...tagProps}
        >
            {`${row[textKey]} (${row[valueKey]})`}
        </Tag>
    );
}

export function ValueTextTagPickerGroup({ rows, valueKey = "Value", textKey = "Text"  }: TagPickerGroupComponentProps) {
    return (
        <TagPickerGroup aria-label="Selected Company Codes">
            {rows.map((row, i) => {
                return (
                    <Tag
                        key={`tag-${i}`}
                        media={
                            <Avatar
                                aria-hidden
                                icon={<BriefcaseRegular />}
                            />
                        }
                        value={row.Code as string}
                    >
                        {`${row[textKey]} (${row[valueKey]})`}
                    </Tag>
                );
            })}
        </TagPickerGroup>
    );
}

export function ValueTextTagPickerOption({ row, rows, valueKey = "Value", textKey = "Text"  }: TagPickerOptionComponentProps) {
    const selected = rows.find(r => r.Code === row.Code);
    return (
        <TagPickerOption
            secondaryContent={row[valueKey] as string}
            media={<Avatar shape="square" icon={<BriefcaseRegular />} aria-hidden active={selected ? 'active' : 'unset'} />}
            value={selected ? `selected-${row[valueKey]}` : row[valueKey] as string}
        >
            {row[textKey] as string}
        </TagPickerOption>
    );
}

export function valueTextFilterRows({ rows, query, valueKey = "Value", textKey = "Text" }: FilterRowsProps) {
    return query === '' ? rows : rows.filter(r => {
        return `${r[textKey]} (${r[valueKey]})`.toLowerCase().includes(query.toLowerCase());
    });
}