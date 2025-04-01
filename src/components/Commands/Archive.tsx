import { Field, Input, makeStyles, Popover, PopoverSurface, PopoverTrigger, Subtitle2, tokens, ToolbarButton } from "@fluentui/react-components";
import { ArrowDownloadRegular, LinkRegular, Warning20Regular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../hooks/useFormInitQuery";

const useStyles = makeStyles({
    archive: {
        display: 'flex',
        alignItems: 'center'
    },
    archiveIcon: {
        paddingLeft: '8px',
        paddingRight: '4px'
    },
    archiveText: {
        color: tokens.colorNeutralForeground4
    }
});
const usePopoverStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: '480px'
    },
    label: {
        fontWeight: tokens.fontWeightSemibold,
        marginTop: tokens.spacingVerticalXXS,
        marginBottom: tokens.spacingVerticalXXS
    }
});

export const Archive = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    return (
        <div className={styles.archive}>
            <Warning20Regular className={styles.archiveIcon} color={tokens.colorPaletteDarkOrangeForeground1} />
            <Subtitle2 className={styles.archiveText}>{t('THIS IS AN ARCHIVED COPY OF THE FORM')}</Subtitle2>
        </div>
    );
};

export const ArchiveDownload = () => {
    const { t } = useTranslation();
    const { formArchiveUrl } = useFormInitQuery();
    return (
        <ToolbarButton 
            icon={<ArrowDownloadRegular />} 
            onClick={() => window.open(`${formArchiveUrl}&ATTACHMENT=Y`, '_blank')}
        >
            {t('Download')}
        </ToolbarButton>
    );
};

export const ArchiveCopyLink = () => {
    const styles = usePopoverStyles();
    const { t } = useTranslation();
    const { formArchiveUrl } = useFormInitQuery();
    return (
        <Popover positioning="below-end" withArrow>
            <PopoverTrigger>
                <ToolbarButton icon={<LinkRegular />}>{t('Copy link')}</ToolbarButton>
            </PopoverTrigger>
            <PopoverSurface>
                <Field className={styles.root} label={'fff'}>
                    <Input 
                        readOnly
                        defaultValue={`${formArchiveUrl}&ATTACHMENT=N`}
                        onFocus={(ev) => ev.target.select()}
                    />
                </Field>
            </PopoverSurface>
        </Popover>
    );
};