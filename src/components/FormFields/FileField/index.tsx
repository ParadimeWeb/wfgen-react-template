import { Text, Button, Field, makeStyles, mergeClasses, TagGroup, tokens, typographyStyles, type FieldProps, type TagProps } from "@fluentui/react-components";
import { useRef } from "react";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { FileTag, type TFile } from "./FileTag";
import { useTranslation } from "react-i18next";
import { ArrowUploadRegular } from "@fluentui/react-icons";
import { useForm, useStore } from "@tanstack/react-form";
import { csvToSet, downloadFile } from "../../../utils";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFieldContext } from "../../../hooks/formContext";
import type { DataRow } from "../../../types";
import { ZipFileCard } from "./ZipFileCard";

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
    },
    validationMessage: {
        whiteSpace: 'pre-wrap'
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
    fields?: string[]
    mode?: 'field' | 'zip'
    /**
     * Max content length in bytes
     * Default: 4194304 bytes = 4 MB
     */
    maxAllowedContentLength?: number
    disabled?: boolean
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
    const field = useFieldContext();

    return (
        <Field label={t(field.name)} {...printFieldProps}>
            {files.length > 0 ? 
            <TagGroup className={styles.tagGroup}>
                {files.map(([_, fu]) => {
                    const Key = fu.get('Key')!;
                    const fileName = fu.get('Name')!;
                    const filePath = fu.get('Path')!;
                    return (
                        <FileTag 
                            key={`fileTag_${Key}`}
                            maxFileNameLength={maxFileNameLength}
                            file={{ Key, Name: fileName }}
                            value={Key} 
                            size={tagSize} 
                            onClick={() => { downloadFile(Key, filePath); }}
                        />
                    );
                })}
            </TagGroup> : 
            <Text>{t('No file')}</Text>}
        </Field>
    );
}
function ReadonlyView(props: Omit<FileFieldProps, 'mode'> & { mode: 'field' | 'fields' | 'zip', files: [string, URLSearchParams][] }) {
    const {
        readonlyFieldProps = {},
        mode,
        fields = [],
        files,
        tagSize,
        maxFileNameLength = 32
    } = props;
    const styles = useStyles();
    const { t } = useTranslation();
    const { isArchive } = useFormInitQuery();
    const field = useFieldContext();
    const { form } = useWfgFormContext();
    const { state: { values: { __ZipFiles: [ZipFiles] } } } = form;

    return (
        <form.Subscribe 
            selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
            children={FORM_FIELDS_REQUIRED => {
                const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
                const required = requiredFields.has(field.name.replace('Table1[0].', ''));
                return (
                    <Field
                        required={required}
                        label={t(field.name)} 
                        {...readonlyFieldProps}
                    >
                        {files.length > 0 ? 
                        isArchive && mode === 'zip' && ZipFiles[fields[0]] ?
                        <ZipFileCard field={fields[0]} value={field.state.value as string} zipFiles={ZipFiles} maxFileNameLength={maxFileNameLength} /> :
                        <TagGroup className={styles.tagGroup}>
                            {files.map(([_, fu]) => {
                                const Key = fu.get('Key')!;
                                const fileName = fu.get('Name')!;
                                const filePath = fu.get('Path')!;
                                return (
                                    <FileTag 
                                        key={`fileTag_${Key}`}
                                        maxFileNameLength={maxFileNameLength}
                                        file={{ Key, Name: fileName }}
                                        value={Key} 
                                        size={tagSize} 
                                        onClick={() => {
                                            if (isArchive) {
                                                window.open(filePath);
                                            }
                                            else {
                                                downloadFile(Key, filePath);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </TagGroup> : 
                        <Text>{t('No file')}</Text>}
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
            isDragOver: false,
            files: [] as TFile[]
        },
        onSubmit: ({ value: { files: fileUploads } }) => {
            if (mode === 'fields') {
                fileUploads.forEach((fuRes, i) => {
                    const fu = new URLSearchParams();
                    fu.set("Key", availableFields[i]);
                    fu.set("Name", fuRes.Name);
                    fu.set("Path", fuRes.Path!);
                    form.setFieldValue(`Table1[0].${availableFields[i]}`, fu.toString());
                    field.pushValue({ Field: availableFields[i] });
                });
                uploadForm.reset();
                return;
            }
            if (mode === 'zip') {
                const fu = new URLSearchParams();
                const names = files.length > 0 ? files[0][1].getAll('Name') : [];
                const paths = files.length > 0 ? files[0][1].getAll('Path') : [];
                let i = 0;
                for (; i < names.length; i++) {
                    fu.append('Key', `Zip${i}`);
                    fu.append('Path', paths[i]);
                    fu.append('Name', names[i]);
                }
                fileUploads.forEach((fuRes, index) => {
                    fu.append("Key", `Zip${i + index}`);
                    fu.append("Path", fuRes.Path!);
                    fu.append("Name", fuRes.Name);
                });
                console.log(fu.toString());
                field.handleChange(fu.toString());
                uploadForm.reset();
                return;
            }
            const fu = new URLSearchParams();
            fu.set("Key", fields[0]);
            fu.set("Path", fileUploads[0].Path!);
            fu.set("Name", fileUploads[0].Name);
            field.handleChange(fu.toString());
            uploadForm.reset();
        }
    });
    const availableFields = mode === 'fields' ? fields.filter(f => !values.has(f)) : [];

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
                            onChange: ({ value }) => {
                                const errorFiles = value.filter(f => f.Error !== undefined);
                                if (errorFiles.length > 0) {
                                    return errorFiles.map(f => t(f.Error!, { name: f.Name }));
                                }

                                const uploadFiles = value.filter(f => { return f.File !== undefined; });
                                if (uploadFiles.length > 0) {
                                    if (mode === 'fields' && uploadFiles.length > availableFields.length) {
                                        return [t('A maximum of {{count, number}} files can be uploaded. Delete some files to try again.', { count: fields.length })];
                                    }
                            
                                    let contentLength = 0;
                                    for (let i = 0; i < uploadFiles.length; i++) { 
                                        contentLength += uploadFiles[0].File!.size;
                                    }
                                    if (contentLength > maxAllowedContentLength) {
                                        const sizes = { bytes: t('bytes'), kiloBytes: t('kiloBytes'), megaBytes: t('megaBytes'), gigaBytes: t('gigaBytes') };
                                        return [t('A maximum content size of {{max}} can be uploaded at one time. Failed to upload {{actual}}.', { 
                                            max: t(readableBytes(maxAllowedContentLength, locale), sizes),
                                            actual: t(readableBytes(contentLength, locale), sizes)
                                        })];
                                    }
                                    return undefined;
                                }

                                if (fileInput?.current) {
                                    fileInput.current.value = '';
                                }
                                uploadForm.handleSubmit();
                                return undefined;
                            }
                        }}
                        children={uploadFilesField => {
                            const fileTags: TFile[] = [
                                ...files.flatMap(([_, fu]) => { 
                                    const names = fu.getAll('Name');
                                    const paths = fu.getAll('Path');
                                    return fu.getAll('Key').map((Key, i) => ({ Key, Name: names[i], Path: paths[i] }));
                                }),
                                ...uploadFilesField.state.value
                            ];
                            const filesUploading = uploadFilesField.state.value.filter(f => f.File !== undefined);
                            const uploadFilesStartIndex = fileTags.length - uploadFilesField.state.value.length;
                            return (
                                <Field
                                    label={t(field.name)}
                                    validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors[0]) : uploadFilesField.state.meta.errors.length > 0 ? { className: styles.validationMessage, children: uploadFilesField.state.meta.errors.join('\n') } : null}
                                    required={required}
                                    className={mergeClasses(fieldProps.className, styles.dragDrop)}
                                    onDragEnter={() => { uploadForm.setFieldValue('isDragOver', true); }}
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
                                                    uploadFilesField.handleChange([...ev.target.files].map((f, i) => ({ Key: `Upload${i}`, Name: f.name, File: f } as TFile)));
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
                                                disabled={disabled || filesUploading.length > 0}
                                            >
                                                {t('Select files or drag them here', { count: mode === 'zip' ? 2 : fields.length })}
                                            </Button>
                                        </Field> : null}
                                        <TagGroup
                                            className={mergeClasses(styles.tagGroup, mode === 'zip' && styles.paddingTop)}
                                            onDismiss={(_, data) => {
                                                if (mode === 'fields') {
                                                    field.removeValue(files.findIndex(([field]) => field === data.value));
                                                    return;
                                                }
                                                if (mode === 'zip') {
                                                    const fu = files[0][1];
                                                    const keys = fu.getAll('Key');
                                                    const names = fu.getAll('Name');
                                                    const paths = fu.getAll('Path');
                                                    const i = keys.indexOf(data.value);
                                                    fu.delete('Key', data.value);
                                                    fu.delete('Name', names[i]);
                                                    fu.delete('Path', paths[i]);
                                                    field.handleChange(keys.length === 1 ? 'Key=Zip0' : fu.toString());
                                                    return;
                                                }
                                                field.handleChange(`Key=${data.value}`);
                                            }}
                                        >
                                            {fileTags.map((f, i) => {
                                                return (
                                                    <FileTag 
                                                        key={`fileTag-${i}`}
                                                        hasSecondaryAction
                                                        field={availableFields.length > i ? availableFields[i] : fields[0]}
                                                        value={f.Key}
                                                        file={f}
                                                        size={tagSize} 
                                                        disabled={disabled}
                                                        maxFileNameLength={maxFileNameLength}
                                                        onUploaded={(f) => {
                                                            console.log(i - uploadFilesStartIndex, f);
                                                            uploadFilesField.replaceValue(i - uploadFilesStartIndex, { ...f });
                                                        }}
                                                        onClick={() => {
                                                            downloadFile(f.Key, f.Path!);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </TagGroup>
                                        <uploadForm.Subscribe 
                                            selector={s => s.values.isDragOver}
                                            children={isDragOver => isDragOver && !disabled ? (
                                                <div 
                                                    className={styles.overlayUpload}
                                                    onDragLeave={() => { uploadForm.setFieldValue('isDragOver', false); }}
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
                                                            uploadFilesField.handleChange(files.map((f, i) => ({ Key: `Upload${i}`, Name: f.name, File: f } as TFile)));
                                                        }
                                                        else {
                                                            uploadFilesField.handleChange([...ev.dataTransfer.files].map((f, i) => ({ Key: `Upload${i}`, Name: f.name, File: f } as TFile)));
                                                        }
                                                        uploadForm.setFieldValue('isDragOver', false);
                                                    }}
                                                ></div>
                                            ) : null}
                                        />
                                    </>)}
                                </Field>
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
    return isPrintView ? <PrintView {...props} files={files} /> : isArchive || readonlyFields.has(field.name.replace('Table1[0].', '')) ? <ReadonlyView {...props} fields={fields} mode={mode} files={files} /> : <View {...props} fields={fields} mode={mode} values={values} files={files} />;
};