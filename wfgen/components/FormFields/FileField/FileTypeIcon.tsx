import { DEFAULT_BASE_URL, initializeFileTypeIcons } from '@wfgen/react-file-type-icons/initializeFileTypeIcons';
import { getFileTypeIconNameFromExtensionOrType, getFileTypeIconSuffix } from '@wfgen/react-file-type-icons/getFileTypeIconProps';
import type { IFileTypeIconOptions } from '@wfgen/react-file-type-icons/getFileTypeIconProps';

initializeFileTypeIcons();

export const FileTypeIcon = ({
    baseUrl = DEFAULT_BASE_URL,
    size = 20,
    imageFileType = 'svg',
    fileName,
    type
}: Omit<IFileTypeIconOptions, 'extension'> & { baseUrl?: string; fileName: string; }) => {
    const baseSuffix = getFileTypeIconSuffix(size, imageFileType); // eg: 96_3x_svg or 96_png
    const suffixArray = baseSuffix.split('_'); // eg: ['96', '3x', 'svg']
    const fileNameSplit = fileName.split('.');
    const extension = fileNameSplit.length > 1 ? fileNameSplit[fileNameSplit.length - 1] : undefined;
    const baseIconName = getFileTypeIconNameFromExtensionOrType(extension, type); // eg: docx

    if (suffixArray.length === 3) {
        /** suffix is of type 96_3x_svg  - it has a pixel ratio > 1*/
        return <img src={`${baseUrl}${size}_${suffixArray[1]}/${baseIconName}.${suffixArray[2]}`} height="100%" width="100%" alt={baseIconName} />;
    } 
    /** suffix is of type 96_svg  - it has a pixel ratio of 1*/
    return <img src={`${baseUrl}${size}/${baseIconName}.${suffixArray[1]}`} alt={baseIconName} />;
};