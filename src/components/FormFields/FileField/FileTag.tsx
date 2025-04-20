import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, type TagSize, Tooltip, type InteractionTagPrimaryProps, type InteractionTagProps, makeStyles, tokens, mergeClasses, ProgressBar, Tag, Field } from "@fluentui/react-components";
import { FileTypeIcon } from "./FileTypeIcon";
import type { FileTypeIconSize } from "../../../react-file-type-icons/getFileTypeIconProps";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { post } from "../../../utils";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";

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
    },
    error: {
        textDecoration: 'line-through'
    }
});

function readableBytes(bytes: number, locale: string) {
    if (bytes < 1) return '0 {{bytes}}';
    let numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    let i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['{{bytes}}', '{{kiloBytes}}', '{{megaBytes}}', '{{gigaBytes}}'],
    readableNumber = bytes / Math.pow(1024, i);
    return `${numberFormat.format(readableNumber)} ${sizes[i]}`;
}

export type TFile = {
    Key: string
    Path?: string
    Name: string
    File?: File
};
type FileTagProps = { 
    field?: string
    value?: string
    file: TFile
    onUploaded?: (result: TFile) => void 
    maxFileNameLength: number
    maxAllowedContentLength?: number
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
        maxAllowedContentLength = 0,
        size = 'medium', 
        onUploaded = () => {},
        hasSecondaryAction = false,
        onClick
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const sizes = { bytes: t('bytes'), kiloBytes: t('kiloBytes'), megaBytes: t('megaBytes'), gigaBytes: t('gigaBytes') };
    const { locale } = useFormInitQuery();
    const form = useForm({
        defaultValues: {
            percentComplete: 0
        }
    });
    const { isFetching } = useQuery({
        queryKey: [field, file.Key],
        queryFn: async () => {
            const { File: uploadFile } = file;
            if (uploadFile === undefined) {
                const data = {
                    ...file,
                    Path: '__Error'
                };
                onUploaded(data);
                return data;
            }
    
            if (uploadFile.size > maxAllowedContentLength) {
                const data = {
                    ...file,
                    File: undefined,
                    Path: `__Error__Size__${uploadFile.size}`
                };
                onUploaded(data);
                return data;
            }

            const data = new FormData();
            data.append('field', field);
            data.append('key', file.Key);
            data.append('file', uploadFile);
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
        retry: false,
        retryOnMount: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    const pathSplit = file.Path?.startsWith('__Error') ? file.Path.split('__').filter(o=>o) : ['', ''];
    const error =   pathSplit[0] === 'Error' ? pathSplit[1] === 'Size' ? 
                        t('A maximum content size of {{max}} can be uploaded. Failed to upload {{actual}}.', { 
                            max: t(readableBytes(maxAllowedContentLength, locale), sizes),
                            actual: t(readableBytes(Number(pathSplit[2]), locale), sizes)
                        }) :
                        t('No file to upload') : 
                        '';
                        
    if (error.length > 0) {
        return (
            <Field
                validationMessage={error}
            >
                {file.Name.length > maxFileNameLength ? 
                <Tooltip relationship="label" content={file.Name}>
                    <Tag
                        size={size}
                        dismissible
                        className={styles.error}
                        value={value}
                    >
                        {file.Name.substring(0, file.Name.length - (file.Name.length - maxFileNameLength))}&hellip;
                    </Tag>
                </Tooltip>
                :
                <Tag
                    size={size}
                    dismissible
                    className={styles.error}
                    value={value}
                >
                    {file.Name}
                </Tag>}
            </Field>
        );
    }
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