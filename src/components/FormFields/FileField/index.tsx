import { Text, Button, Field, makeStyles, mergeClasses, Spinner, TagGroup, tokens, typographyStyles, type FieldProps, type TagProps } from "@fluentui/react-components";
import { useRef } from "react";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { useMutation } from "@tanstack/react-query";
import { FileTag } from "./FileTag";
import { useTranslation } from "react-i18next";
import { ArrowUploadRegular } from "@fluentui/react-icons";
import { useForm, useStore } from "@tanstack/react-form";
import { csvToSet, post } from "../../../utils";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFieldContext } from "../../../hooks/formContext";

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

type FileFieldProps = {
    fieldProps?: FieldProps
    printFieldProps?: FieldProps
    readonlyFieldProps?: FieldProps
    otherFields?: string[]
    mode?: 'fields' | 'zip'
    /**
     * Max content length in bytes
     * Default: 4194304 bytes = 4 MB
     */
    maxAllowedContentLength?: number
    disabled?: boolean
    onBeforeDownload?: (readOnly: boolean) => { href: string | undefined; [key: string]: any }
    onBeforeUpload?: (formData: FormData) => void
    onAfterUpload?: (uploadedFiles: string[]) => { [field:string]: any }
    tagSize?: TagProps["size"]
    maxFileNameLength?: number
};

function PrintView(props: FileFieldProps & { files: string[] }) {
    const {
        printFieldProps = {},
        files,
        tagSize,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive, rootUrl, configuration } = useFormInitQuery();
    const fileUploads = files.map(f => new URLSearchParams(f));
    const fieldsWithFile = fileUploads.filter((fu) => fu.has('Name'));
    const tagGroup = (
        <TagGroup className={styles.tagGroup}>
            {fieldsWithFile.map(fu => {
                const key = fu.get('Key')!;
                const fileName = fu.get('Name')!;
                const fileUrl = fu.get('Url');
                return (
                    <FileTag 
                        key={`fileTag_${key}`}
                        maxFileNameLength={maxFileNameLength}
                        fileName={fileName}
                        value={key} 
                        size={tagSize} 
                        onClick={() => {
                            if (isArchive) {
                                window.open(fileUrl ?? `${rootUrl}show.aspx?QUERY=DOWNLOAD&ID_PROCESS_INST=${configuration.WF_PROCESS_INST_ID}&ID_ACTIVITY_INST=${configuration.WF_ACTIVITY_INST_ID}&PARAM_NAME=${key}&ATTACHMENT=N`);
                            }
                            else {
                                //downloadFile(ctx, fu.field, fu.path!, onBeforeDownload(false));
                            }
                        }}
                    />
                );
            })}
        </TagGroup>
    );

    return (
        <Field label={t('File')} {...printFieldProps}>
            {fieldsWithFile.length > 0 ? tagGroup : <Text>{t('No file')}</Text>}
        </Field>
    );
}
function ReadonlyView(props: FileFieldProps & { files: string[] }) {
    const {
        readonlyFieldProps = {},
        files,
        tagSize,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive, rootUrl, configuration } = useFormInitQuery();
    const field = useFieldContext<string>();
    const { form } = useWfgFormContext();
    const fileUploads = files.map(f => new URLSearchParams(f));
    const fieldsWithFile = fileUploads.filter((fu) => fu.has('Name'));
    const tagGroup = (
        <TagGroup className={styles.tagGroup}>
            {fieldsWithFile.map(fu => {
                const key = fu.get('Key')!;
                const fileName = fu.get('Name')!;
                const fileUrl = fu.get('Url');
                return (
                    <FileTag 
                        key={`fileTag_${key}`}
                        maxFileNameLength={maxFileNameLength}
                        fileName={fileName}
                        value={key} 
                        size={tagSize} 
                        onClick={() => {
                            if (isArchive) {
                                window.open(fileUrl ?? `${rootUrl}show.aspx?QUERY=DOWNLOAD&ID_PROCESS_INST=${configuration.WF_PROCESS_INST_ID}&ID_ACTIVITY_INST=${configuration.WF_ACTIVITY_INST_ID}&PARAM_NAME=${key}&ATTACHMENT=N`);
                            }
                            else {
                                //downloadFile(ctx, fu.field, fu.path!, onBeforeDownload(false));
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
                        {fieldsWithFile.length > 0 ? tagGroup : <Text>{t('No file')}</Text>}
                    </Field>
                );
            }}
        />
    );
}
function View(props: FileFieldProps & { files: string[] }) {
    const {
        fieldProps = {},
        mode = "fields",
        files,
        tagSize,
        maxAllowedContentLength = 4194304,
        onBeforeDownload = () => ({ href: undefined }),
        onBeforeUpload = () => {},
        onAfterUpload = () => ({}),
        disabled = false,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { locale } = useFormInitQuery();
    const field = useFieldContext<string>();
    const { form } = useWfgFormContext();
    const fileUploads = files.map(f => new URLSearchParams(f));
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
            return post<string[]>(mode === 'zip' ? 'ASYNC_UPLOAD_ZIP' : 'ASYNC_UPLOAD', { data: formData, config: {
                onUploadProgress: (progressEvent) => {
                    uploadForm.setFieldValue('percentComplete', progressEvent.loaded / (progressEvent.total ?? 1));
                }
            }})
        },
        onMutate: (formData) => {
            onBeforeUpload(formData);
        }
    });
    
    const fieldsWithFile = fileUploads.filter((fu) => fu.has('Name'));
    const tagGroup = (
        <TagGroup
            className={mergeClasses(styles.tagGroup, mode === 'zip' && styles.paddingTop)}
            onDismiss={(_, data) => {
                form.setFieldValue(`Table1[0].${data.value}`, `Key=${data.value}`);
            }}
        >
            {fieldsWithFile.map((fu) => {
                const key = fu.get('Key')!;
                return (
                    <FileTag
                        key={`fileTag_${key}`}
                        maxFileNameLength={maxFileNameLength}
                        fileName={fu.get('Name')!}
                        value={key} 
                        size={tagSize} 
                        disabled={disabled}
                        hasSecondaryAction 
                        onClick={() => {}} //downloadFile(ctx, fu.field, fu.path!, onBeforeDownload(false))}
                    />
                );
            })}
        </TagGroup>
    );

    async function upload(files: FileList | File[] | null) {
        if (files === null || files.length < 1) {
            return undefined;
        }
        const formData = new FormData();
        if (mode === 'zip') {
            formData.append("field", field.name);
        }
        else {
            const availableFields = fileUploads.length < 2 ? fileUploads.map(f => f.get('Key')!) : fileUploads.filter(f => !f.has('Name')).map(f => f.get('Key')!);
            if (files.length > availableFields.length) {
                return t('A maximum of {{count, number}} files can be uploaded. Delete some files to try again.', { count: fileUploads.length });
            }
            formData.append("fields", JSON.stringify(availableFields));
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
            formData.append("file" + i, file);
        }
        let result: string | undefined = undefined;
        await mutateAsync(formData, {
            onSuccess: (result) => {
                onAfterUpload(result.data);
                if (mode === 'zip') {
                    field.handleChange(result.data[0]);
                }
                else {
                    result.data.forEach((value) => {
                        const fu = new URLSearchParams(value);
                        form.setFieldValue(`Table1[0].${fu.get('Key')}`, value);
                    });
                }
            },
            onError: (error) => {
                result = error.message;
            }
        });
        return result;
    }

    if (mode === 'zip' || fileUploads.length < 2 || fieldsWithFile.length !== fileUploads.length) {
        return (
            <form.Subscribe 
                selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
                children={FORM_FIELDS_REQUIRED => {
                    const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                    const required = requiredFields.has(field.name.replace('Table1[0].', ''));
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
                                                            multiple={mode === 'zip' || fileUploads.length > 1}
                                                            ref={fileInput}
                                                            className={styles.fileInput}
                                                            onChange={(ev) => {
                                                                if (ev.target.files !== null) {
                                                                    filesField.handleChange(ev.target.files);
                                                                }
                                                            }}
                                                        />
                                                        {mode === 'zip' || fieldsWithFile.length !== fileUploads.length ? 
                                                        <Field hint={mode === 'fields' && fileUploads.length > 1 ? t('You can upload {{count, number}} more files for a maximum of {{max, number}}.', { count: fileUploads.length - fieldsWithFile.length, max: fileUploads.length }) : null}>
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
                                                                {t('Select files or drag them here', { count: mode === 'zip' ? 2 : fileUploads.length })}
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
    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field label={t('File')} required={required} {...fieldProps}>
                        {tagGroup}
                    </Field>
                );
            }}
        />
    );
}

export default (props: FileFieldProps) => {
    const { otherFields = [], mode = 'fields' } = props;
    const field = useFieldContext<string>();
    const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
    const { isArchive } = useFormInitQuery();
    const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
    const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
    if (mode === 'zip') {
        const files = field.state.value.split('Key=').filter(o => o).map(v => `Key=${v}`);
        return isPrintView ? <PrintView {...props} files={files} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} files={files} /> : <View {...props} files={files} />;
    }
    return (
        <form.Subscribe 
            selector={(s) => Object.fromEntries(otherFields.map(f => [f, s.values.Table1[0][f] as string]))}
            children={(otherFiles) => {
                const files = [field.state.value, ...Object.values(otherFiles)];
                return isPrintView ? <PrintView {...props} files={files} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} files={files} /> : <View {...props} files={files} />;
            }}
        />
    );
};