import { useEffect, useState, type ComponentProps } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import FileTypeIcon from '../icons/file-type-icon'

export type FileIconProps = {
    file: File
}

const IconWraper = ({ children }: ComponentProps<'span'>) => {
    const { classNames: configClassNames } = useConfig()
    const uploadClassNames = configClassNames?.upload

    return (
        <span
            className={classNames(
                'upload-file-icon',
                uploadClassNames?.fileIcon,
            )}
        >
            {children}
        </span>
    )
}

const getFileType = (file: File) => {
    const extensionIndex = file.name.lastIndexOf('.')

    if (extensionIndex >= 0 && extensionIndex < file.name.length - 1) {
        return file.name.slice(extensionIndex + 1)
    }

    const [category, subType] = file.type.split('/')

    if (category === 'video') {
        return 'video'
    }

    return subType || category || 'file'
}

const FileIcon = ({ file }: FileIconProps) => {
    const { classNames: configClassNames } = useConfig()
    const uploadClassNames = configClassNames?.upload
    const isImageFile = file.type.split('/')[0] === 'image'
    const [previewUrl, setPreviewUrl] = useState<string>()

    useEffect(() => {
        if (!isImageFile) {
            setPreviewUrl(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(file)

        setPreviewUrl(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [file, isImageFile])

    const renderIcon = () => {
        if (isImageFile && previewUrl) {
            return (
                <img
                    className={classNames(
                        'upload-file-image max-w-full',
                        uploadClassNames?.fileImage,
                    )}
                    src={previewUrl}
                    alt={`file preview ${file.name}`}
                />
            )
        }

        return (
            <IconWraper>
                <FileTypeIcon type={getFileType(file)} size={36} />
            </IconWraper>
        )
    }

    return <>{renderIcon()}</>
}

export default FileIcon
