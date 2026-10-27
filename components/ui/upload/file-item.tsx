import FileIcon from './file-icon'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ReactNode, ComponentProps } from 'react'

const BYTE = 1000
const getKB = (bytes: number) => Math.round(bytes / BYTE)

export type FileItemProps = ComponentProps<'div'> & {
    file: File
    closeButton: ReactNode
}

const FileItem = (props: FileItemProps) => {
    const { file, className, closeButton, children } = props
    const { name, size } = file
    const { classNames: configClassNames } = useConfig()
    const uploadClassNames = configClassNames?.upload

    return (
        <div
            className={classNames(
                'upload-file border rounded-card mb-2',
                uploadClassNames?.item,
                className,
            )}
        >
            <div
                className={classNames(
                    'upload-file-wrapper flex items-center justify-between',
                    uploadClassNames?.itemWrapper,
                )}
            >
                <div className="upload-file-info-wrapper flex items-center">
                    <div
                        className={classNames(
                            'upload-file-thumbnail p-2 flex justify-center items-center min-h-16 w-16',
                            uploadClassNames?.thumbnail,
                        )}
                    >
                        {<FileIcon file={file} />}
                    </div>
                    <div
                        className={classNames(
                            'upload-file-info flex flex-col justify-center ltr:ml-3 rtl:mr-3 min-h-16',
                            uploadClassNames?.fileInfo,
                        )}
                    >
                        <h6
                            className={classNames(
                                'upload-file-name text-sm font-medium',
                                uploadClassNames?.fileName,
                            )}
                        >
                            {name}
                        </h6>
                        <span
                            className={classNames(
                                'upload-file-size',
                                uploadClassNames?.fileSize,
                            )}
                        >
                            {getKB(size)} kb
                        </span>
                    </div>
                </div>
                {closeButton}
            </div>
            {children}
        </div>
    )
}

FileItem.displayName = 'UploadFileItem'

export default FileItem
