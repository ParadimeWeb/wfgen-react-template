import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Tooltip, type InteractionTagPrimaryProps, type InteractionTagProps } from "@fluentui/react-components";
import { FileTypeIcon } from "./FileTypeIcon";


export const FileTag = ({ fileName, value, size, onClick, hasSecondaryAction, disabled, maxFileNameLength }: { fileName: string; maxFileNameLength: number; } & Pick<InteractionTagProps, "value" | "size" | "disabled"> & Pick<InteractionTagPrimaryProps, "onClick" | "hasSecondaryAction">) => {
    return (
        <InteractionTag
            appearance="outline"
            value={value}
            size={size}
            disabled={disabled}
        >
            {fileName.length > maxFileNameLength ?
            <Tooltip relationship="label" content={fileName}>
                <InteractionTagPrimary
                    hasSecondaryAction={hasSecondaryAction}
                    icon={<FileTypeIcon fileName={fileName} size={20} />}
                    onClick={onClick}
                >
                    {fileName.substring(0, fileName.length - (fileName.length - maxFileNameLength))}&hellip;
                </InteractionTagPrimary>
            </Tooltip> :
            <InteractionTagPrimary
                hasSecondaryAction={hasSecondaryAction}
                icon={<FileTypeIcon fileName={fileName} size={20} />}
                onClick={onClick}
            >
                {fileName}
            </InteractionTagPrimary>}
            {hasSecondaryAction && <InteractionTagSecondary />}
        </InteractionTag>
    );
};