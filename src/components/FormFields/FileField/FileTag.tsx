import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, type TagSize, Tooltip, type InteractionTagPrimaryProps, type InteractionTagProps, makeStyles, tokens, mergeClasses, ProgressBar } from "@fluentui/react-components";
import { FileTypeIcon } from "./FileTypeIcon";
import type { FileTypeIconSize } from "../../../react-file-type-icons/getFileTypeIconProps";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { post } from "../../../utils";

const useStyles = makeStyles({
    uploading: {
        position: 'relative'
    },
    progressBar: {
        position: 'absolute', 
        bottom: 0, 
        borderTopLeftRadius: 'unset', 
        borderTopRightRadius: 'unset'
    },
    bar: {
        borderTopRightRadius: tokens.borderRadiusMedium
    }
});

export type TFile = {
    Key: string
    Path?: string
    Name: string
    Error?: string
    File?: File
};
type FileTagProps = { 
    field?: string
    value?: string
    file: TFile
    onUploaded?: (result: TFile) => void 
    maxFileNameLength: number; 
} & Pick<InteractionTagProps, "value" | "size" | "disabled"> & Pick<InteractionTagPrimaryProps, "onClick" | "hasSecondaryAction">;

export const fileIconSize = new Map<TagSize, FileTypeIconSize>([
    ['extra-small', 16],
    ['small', 16],
    ['medium', 20]
]);

export const FileTag = (props: FileTagProps) => {
    const { 
        field = '', 
        value = '',
        file, 
        maxFileNameLength, 
        size = 'medium', 
        onUploaded = () => {},
        hasSecondaryAction = false,
        onClick
    } = props;
    const styles = useStyles();
    const form = useForm({
        defaultValues: {
            percentComplete: 0
        }
    });

    const { isFetching } = useQuery({
        queryKey: [field, file.Key],
        queryFn: async () => {
            const data = new FormData();
            data.append('field', field);
            data.append('key', file.Key);
            data.append('file', file.File!);
            return post<TFile>('ASYNC_UPLOAD', { data, config: {
                onUploadProgress: (progressEvent) => {
                    form.setFieldValue('percentComplete', progressEvent.loaded / (progressEvent.total ?? 1));
                }
            }}).then(res => {
                onUploaded(res.data);
                return res.data;
            });
        },
        enabled: file.File !== undefined,
        retryOnMount: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    return (
        <InteractionTag
            size={size}
            appearance="outline"
            value={value}
            className={mergeClasses(isFetching && styles.uploading)}
        >
            {file.Name.length > maxFileNameLength ?
            <Tooltip relationship="label" content={file.Name}>
                <InteractionTagPrimary
                    hasSecondaryAction={hasSecondaryAction}
                    icon={<FileTypeIcon fileName={file.Name} size={fileIconSize.get(size)} />}
                    onClick={onClick}
                >
                    {file.Name.substring(0, file.Name.length - (file.Name.length - maxFileNameLength))}&hellip;
                </InteractionTagPrimary>
            </Tooltip> :
            <InteractionTagPrimary
                hasSecondaryAction={hasSecondaryAction}
                icon={<FileTypeIcon fileName={file.Name} size={fileIconSize.get(size)} />}
                onClick={onClick}
            >
                {file.Name}
            </InteractionTagPrimary>}
            {hasSecondaryAction && <InteractionTagSecondary />}
            {isFetching ?
            <form.Subscribe 
                selector={s => s.values.percentComplete}
                children={percentComplete => {
                    return (
                        <ProgressBar className={styles.progressBar} bar={{ className: styles.bar }} color="success" thickness="large" value={percentComplete} />
                    );
                }}
            /> : null}
        </InteractionTag>
    );
};