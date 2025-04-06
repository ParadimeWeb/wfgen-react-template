import { Text, Button, Field, makeStyles, mergeClasses, Spinner, TagGroup, tokens, typographyStyles, type FieldProps, type TagProps } from "@fluentui/react-components";
import { useRef } from "react";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { useMutation } from "@tanstack/react-query";
import { FileTag } from "./FileTag";
import { useTranslation } from "react-i18next";
import { ArrowUploadRegular } from "@fluentui/react-icons";
import { useForm, useStore } from "@tanstack/react-form";
import { csvToSet, downloadFile, post } from "../../../utils";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";

const useStyles = makeStyles({
    tagGroup: {
        flexWrap: 'wrap',
        gap: tokens.spacingHorizontalXS,
        overflow: 'hidden'
    },
    paddingTop: {
        paddingTop: tokens.spacingHorizontalXS
    },
    fileInput: { display: 'none' },
    dragDrop: {
        position: 'relative',
        width: '100%'
    },
    overlay: {
        backgroundColor: tokens.colorBackgroundOverlay,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlayUpload: {
        color: tokens.colorNeutralForeground1,
        backgroundColor: tokens.colorBackgroundOverlay,
        backgroundImage: 'var(--uploadBackgroundImage)',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: 'center',
        border: `2px dashed ${tokens.colorNeutralForeground1}`,
        top: '-2px',
        right: '-2px',
        bottom: '-2px',
        left: '-2px',
        position: 'absolute',
        '& > svg': {
            position: 'absolute',
            top: '0px',
            right: '0px',
            left: '0px',
            bottom: '0px',
            zIndex: -1
        }
    },
    description: {
        color: tokens.colorNeutralForeground4
    },
    button: {
        alignSelf: 'start',
        textAlign: 'left',
        width: 'fit-content',
        paddingLeft: tokens.spacingHorizontalS,
        paddingRight: tokens.spacingHorizontalS,
        ...typographyStyles.caption1
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

type FileUploadResult = {
    Key: string
    Path?: string
    Name: string
    Error?: string
};
type FileFieldProps = {
    fieldProps?: FieldProps
    printFieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    fields?: string[]
    // otherFields?: string[]
    mode?: 'field' | 'zip'
    /**
     * Max content length in bytes
     * Default: 4194304 bytes = 4 MB
     */
    maxAllowedContentLength?: number
    disabled?: boolean
    onBeforeDownload?: (readOnly: boolean) => { href: string | undefined; [key: string]: any }
    onBeforeUpload?: (formData: FormData) => void
    onAfterUpload?: (uploadedFiles: FileUploadResult[]) => { [field:string]: any }
    tagSize?: TagProps["size"]
    maxFileNameLength?: number
};

function PrintView(props: Omit<FileFieldProps, 'mode'> & { files: [string, URLSearchParams][] }) {
    const {
        printFieldProps = {},
        tagSize,
        files,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const tagGroup = (
        <TagGroup className={styles.tagGroup}>
            {files.map(([_, fu]) => {
                const key = fu.get('Key')!;
                const fileName = fu.get('Name')!;
                const filePath = fu.get('Path')!;
                return (
                    <FileTag 
                        key={`fileTag_${key}`}
                        maxFileNameLength={maxFileNameLength}
                        fileName={fileName}
                        value={key} 
                        size={tagSize} 
                        onClick={() => { downloadFile(key, filePath); }}
                    />
                );
            })}
        </TagGroup>
    );

    return (
        <Field label={t('File')} {...printFieldProps}>
            {files.length > 0 ? tagGroup : <Text>{t('No file')}</Text>}
        </Field>
    );
}
function ReadonlyView(props: Omit<FileFieldProps, 'mode'> & { files: [string, URLSearchParams][] }) {
    const {
        readonlyFieldProps = {},
        files,
        tagSize,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    const field = useFieldContext<string>();
    const { form } = useWfgFormContext();
    const tagGroup = (
        <TagGroup className={styles.tagGroup}>
            {files.map(([_, fu]) => {
                const key = fu.get('Key')!;
                const fileName = fu.get('Name')!;
                const filePath = fu.get('Path')!;
                return (
                    <FileTag 
                        key={`fileTag_${key}`}
                        maxFileNameLength={maxFileNameLength}
                        fileName={fileName}
                        value={key} 
                        size={tagSize} 
                        onClick={() => {
                            if (isArchive) {
                                window.open(filePath);
                            }
                            else {
                                downloadFile(key, filePath);
                            }
                        }}
                    />
                );
            })}
        </TagGroup>
    );

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        required={required}
                        label={t('File')} 
                        {...readonlyFieldProps}
                    >
                        {files.length > 0 ? tagGroup : <Text>{t('No file')}</Text>}
                    </Field>
                );
            }}
        />
    );
}
function View(props: Omit<FileFieldProps, 'mode'> & { mode: 'field' | 'fields' | 'zip', values: Map<string, URLSearchParams>, files: [string, URLSearchParams][] }) {
    const {
        fieldProps = {},
        fields = [],
        mode,
        values,
        files,
        tagSize,
        maxAllowedContentLength = 4194304,
        // onBeforeDownload = () => ({ href: undefined }),
        onBeforeUpload = () => {},
        onAfterUpload = () => ({}),
        disabled = false,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { locale } = useFormInitQuery();
    const { form } = useWfgFormContext();
    const field = useFieldContext<DataRow[] | string>();
    const fileInput = useRef<HTMLInputElement | null>(null);
    const uploadForm = useForm({
        defaultValues: {
            percentComplete: 0,
            isDragOver: false,
            files: null as FileList | File[] | null
        }
    });
    const percentageFormat = useRef(new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (formData: FormData) => {
            return post<FileUploadResult[]>('ASYNC_UPLOAD', { data: formData, config: {
                onUploadProgress: (progressEvent) => {
                    uploadForm.setFieldValue('percentComplete', progressEvent.loaded / (progressEvent.total ?? 1));
                }
            }})
        },
        onMutate: (formData) => {
            onBeforeUpload(formData);
        }
    });
    
    const tagGroup = (
        <TagGroup
            className={mergeClasses(styles.tagGroup, mode === 'zip' && styles.paddingTop)}
            onDismiss={(_, data) => {
                console.log('onDismiss', data.value);
                if (mode === 'fields') {
                    field.removeValue(files.findIndex(([field]) => field === data.value));
                    return;
                }
                if (mode === 'zip') {
                    const fu = files[0][1];
                    const keys = fu.getAll('Keys');
                    const names = fu.getAll('Keys');
                    const paths = fu.getAll('Keys');
                    const i = keys.indexOf(data.value);
                    fu.delete('Key', data.value);
                    fu.delete('Name', names[i]);
                    fu.delete('Path', paths[i]);
                    field.handleChange(fu.toString());
                    return;
                }
                field.handleChange(`Key=${data.value}`);
            }}
        >
            {files.map(([_, fu]) => {
                const names = fu.getAll('Name');
                if (names.length < 1) return null;
                const paths = fu.getAll('Path');
                return fu.getAll('Key').map((key, i) => {
                    return (
                        <FileTag
                            key={`fileTag_${key}`}
                            maxFileNameLength={maxFileNameLength}
                            fileName={names[i]}
                            value={key} 
                            size={tagSize} 
                            disabled={disabled}
                            hasSecondaryAction 
                            onClick={() => {
                                downloadFile(key, paths[i]);
                            }}
                        />
                    );
                });
            })}
        </TagGroup>
    );

    async function upload(files: FileList | File[] | null) {
        if (files === null || files.length < 1) {
            return undefined;
        }
        const formData = new FormData();
        formData.set('mode', mode);

        if (mode === 'fields') {
            const availableFields = fields.filter(f => !values.has(f));
            if (files.length > availableFields.length) {
                return t('A maximum of {{count, number}} files can be uploaded. Delete some files to try again.', { count: fields.length });
            }
            availableFields.forEach((f) => {
                formData.append('field', f);
            });
        }
        else {
            formData.set('field', fields[0]);
        }

        let contentLength = 0;
        for (let i = 0; i < files.length; i++) { 
            contentLength += files[0].size;
        }
        if (contentLength > maxAllowedContentLength) {
            const sizes = { bytes: t('bytes'), kiloBytes: t('kiloBytes'), megaBytes: t('megaBytes'), gigaBytes: t('gigaBytes') };
            return t('A maximum content size of {{max}} can be uploaded at one time. Failed to upload {{actual}}.', { 
                max: t(readableBytes(maxAllowedContentLength, locale), sizes),
                actual: t(readableBytes(contentLength, locale), sizes)
            });
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            formData.append('file', file);
        }
        let result: string | undefined = undefined;
        await mutateAsync(formData, {
            onSuccess: (result) => {
                onAfterUpload(result.data);
                if (mode === 'fields') {
                    result.data.forEach((fuRes) => {
                        const fu = new URLSearchParams();
                        fu.set("Key", fuRes.Key);
                        fu.set("Path", fuRes.Path!);
                        fu.set("Name", fuRes.Name);
                        form.setFieldValue(`Table1[0].${fuRes.Key}`, fu.toString());
                        field.pushValue({ Field: fuRes.Key });
                    });
                    return;
                }
                const fu = new URLSearchParams();
                result.data.forEach((fuRes) => {
                    fu.append("Key", fuRes.Key);
                    fu.append("Path", fuRes.Path!);
                    fu.append("Name", fuRes.Name);
                });
                field.handleChange(fu.toString());
            },
            onError: (error) => {
                result = error.message;
            }
        });
        return result;
    }

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(fields[0]);
                return (
                    <uploadForm.Field 
                        name="files"
                        validators={{
                            onChangeAsync: async ({ value: files }) => {
                                const result = await upload(files);
                                if (fileInput?.current) {
                                    fileInput.current.value = '';
                                }
                                return result;
                            }
                        }}
                        children={filesField => {
                            return (
                                <uploadForm.Field 
                                    name="isDragOver"
                                    children={isDragOverField => {
                                        return (
                                            <Field
                                                label={t('File')}
                                                validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : filesField.state.meta.errors.length > 0 ? t(filesField.state.meta.errors[0] as string) : null}
                                                required={required}
                                                className={mergeClasses(fieldProps.className, styles.dragDrop)}
                                                onDragEnter={() => { isDragOverField.handleChange(true); }}
                                                {...fieldProps} 
                                            >
                                                {fProps => (<>
                                                    <input
                                                        type="file"
                                                        multiple={mode === 'zip' || fields.length > 1}
                                                        ref={fileInput}
                                                        className={styles.fileInput}
                                                        onChange={(ev) => {
                                                            if (ev.target.files !== null) {
                                                                filesField.handleChange(ev.target.files);
                                                            }
                                                        }}
                                                    />
                                                    {mode === 'zip' || files.length !== fields.length ? 
                                                    <Field hint={fields.length > 1 ? t('You can upload {{count, number}} more files for a maximum of {{max, number}}.', { count: fields.length - files.length, max: fields.length }) : null}>
                                                        <Button 
                                                            {...fProps}
                                                            size={fieldProps.size}
                                                            className={styles.button}
                                                            icon={<ArrowUploadRegular />}
                                                            onClick={() => {
                                                                if (fileInput.current) {
                                                                    fileInput.current.click();
                                                                }
                                                            }}
                                                            disabled={disabled}
                                                        >
                                                            {t('Select files or drag them here', { count: mode === 'zip' ? 2 : fields.length })}
                                                        </Button>
                                                    </Field> : null}
                                                    {tagGroup}
                                                    {isDragOverField.state.value && !disabled &&
                                                    <div 
                                                        className={styles.overlayUpload}
                                                        onDragLeave={() => { isDragOverField.handleChange(false); }}
                                                        onDrop={(ev) => {
                                                            if (ev.dataTransfer.items) {
                                                                let files: File[] = [];
                                                                for(let i=0; i<ev.dataTransfer.items.length; i++) {
                                                                    if (ev.dataTransfer.items[i].kind === 'file') {
                                                                        const f = ev.dataTransfer.items[i].getAsFile();
                                                                        if (f !== null)
                                                                            files.push(f);
                                                                    }
                                                                }
                                                                filesField.handleChange(files);
                                                            }
                                                            else {
                                                                filesField.handleChange(ev.dataTransfer.files);
                                                            }
                                                            isDragOverField.handleChange(false);
                                                        }}
                                                    ></div>}
                                                    {isPending && 
                                                    <div className={styles.overlay}>
                                                        <uploadForm.Subscribe 
                                                            selector={s => s.values.percentComplete}
                                                            children={percentComplete => {
                                                                return (
                                                                    <Spinner size="tiny" label={t('uploading... {{percent}}', { percent: percentageFormat.current.format(percentComplete) })} />
                                                                );
                                                            }}
                                                        />
                                                    </div>}     
                                                </>)}
                                            </Field>
                                        );
                                    }}
                                />
                            );
                            
                        }}
                    />
                );
            }}
        />
    );
}

export default (props: FileFieldProps) => {
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const field = useFieldContext<DataRow[] | string>();
    const { isArchive } = useFormInitQuery();
    const shortField = field.name.replace('Table1[0].', '');
    const mode = typeof field.state.value === 'string' ? props.mode ?? 'field' : 'fields';
    const fields = mode === 'fields' ? props.fields : [shortField];
    const values = mode === 'fields' ? 
                    new Map((field.state.value as DataRow[]).map(f => {
                        const field = Object.values(f)[0] as string;
                        return [field, new URLSearchParams(form.state.values.Table1[0][field] as string)];
                    })) :
                    new Map([[shortField, new URLSearchParams(field.state.value as string)]]);
    const files = mode === 'fields' ? Array.from(values) : values.get(shortField)!.getAll('Name').length > 0 ? Array.from(values) : [];
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    return isPrintView ? <PrintView {...props} files={files} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} files={files} /> : <View {...props} fields={fields} mode={mode} values={values} files={files} />;
};