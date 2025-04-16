import { Caption1, Card, CardHeader, Link, makeStyles, Tag, TagGroup, tokens, Tooltip } from "@fluentui/react-components";
import { FileTypeIcon } from "./FileTypeIcon";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import type { DataRow } from "../../../types";

type ZipFileCardProps = {
    field: string
    value: string
    zipFiles: DataRow
    maxFileNameLength: number
};

const useStyles = makeStyles({
    description: { margin: "0 0 12px" },
    card: {
        height: "fit-content",
        width: "fit-content"
    },
    link: {
        color: tokens.colorNeutralForeground1,
        ":hover": {
            color: tokens.colorNeutralForeground1,
            textDecoration: "none"
        }
    },
    tagGroup: {
        flexWrap: 'wrap',
        gap: tokens.spacingHorizontalXS,
        overflow: 'hidden'
    },
    image: {
        width: '32px'
    }
});

export const ZipFileCard = (props: ZipFileCardProps) => {
    const { field, zipFiles, value, maxFileNameLength } = props;
    const styles = useStyles();
    const linkRef = useRef<HTMLAnchorElement>(null);
    const { t } = useTranslation();
    const zipFile = new URLSearchParams(value);
    const href = zipFile.get('Path')!;
    const files = new URLSearchParams(zipFiles[field] as string);
    const names = files.getAll('Name');
    return (
        <Card
            className={styles.card}
            focusMode="off"
            onClick={() => { linkRef.current?.click(); }}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                    linkRef.current?.click();
                }
            }}
        >
            <TagGroup className={styles.tagGroup} role="list">
                {files.getAll('Key').map((_, i) => names[i].length > maxFileNameLength ? (
                    <Tooltip relationship="label" content={names[i]}>
                        <Tag key={`ziptag-${i}`} appearance="outline" icon={<FileTypeIcon fileName={names[i]} size={20} />}>
                            {names[i].substring(0, names[i].length - (names[i].length - maxFileNameLength))}&hellip;
                        </Tag>
                    </Tooltip>
                ) : (
                    <Tag key={`ziptag-${i}`} appearance="outline" icon={<FileTypeIcon fileName={names[i]} size={20} />}>
                        {names[i]}
                    </Tag>
                ))}
            </TagGroup>
            <CardHeader 
                image={{ className: styles.image, children: <FileTypeIcon fileName="Files.zip" size={32} /> }}
                header={
                    <Link
                        ref={linkRef}
                        className={styles.link}
                        target={`_${field}`}
                        href={href}
                    >{t('Zip File')}</Link>
                }
                description={<Caption1>{t('Download the zip file')}</Caption1>}
            />
        </Card>
    );
}