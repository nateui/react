import { useRef, useState, useCallback, useEffect, Fragment } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import FileItem from './file-item'
import FileIcon from './file-icon'
import Button from '../button'
import CloseButton from '../close-button'
import type { ReactNode, ChangeEvent, MouseEvent, ComponentPropsWithRef, JSX } from 'react'
import type { FileIconProps } from './file-icon'

export type UploadProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
    accept?: string
    beforeUpload?: (file: FileList | null, fileList: File[]) => boolean | string
    customFileItem?: (props: {
        file: File
        index: number
        onRemove: () => void
        FileIcon: (props: FileIconProps) => JSX.Element
    }) => ReactNode
    disabled?: boolean
    draggable?: boolean
    fileList?: File[]
    fileListClass?: string
    fileItemClass?: string
    multiple?: boolean
    onBeforeUpload?: (result: boolean | string) => void
    onChange?: (file: File, fileList: File[]) => void
    onFileRemove?: (file: File, fileList: File[]) => void
    showList?: boolean
    tip?: string | ReactNode
    uploadLimit?: number
}

const filesToArray = (files: File[]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(files).map((key) => files[key as any])

const Upload = (props: UploadProps) => {
    const {
        accept,
        beforeUpload,
        customFileItem,
        disabled = false,
        draggable = false,
        fileList,
        fileListClass,
        fileItemClass,
        multiple,
        onChange,
        onFileRemove,
        ref,
        showList = true,
        tip,
        uploadLimit,
        children,
        className,
        onBeforeUpload,
        ...rest
    } = props

    const fileInputField = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<File[]>(fileList || [])
    const [dragOver, setDragOver] = useState(false)
    const { classNames: configClassNames } = useConfig()
    const uploadClassNames = configClassNames?.upload

    useEffect(() => {
        if (JSON.stringify(files) !== JSON.stringify(fileList)) {
            setFiles(fileList || [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(fileList)])

    const pushFile = (newFiles: FileList | null, file: File[]) => {
        if (newFiles) {
            for (const f of newFiles) {
                file.push(f)
            }
        }

        return file
    }

    const addNewFiles = (newFiles: FileList | null) => {
        let file = [...files]
        if (typeof uploadLimit === 'number' && uploadLimit !== 0) {
            if (Object.keys(file).length >= uploadLimit) {
                if (uploadLimit === 1) {
                    file.shift()
                    file = pushFile(newFiles, file)
                }

                return filesToArray({ ...file })
            }
        }
        file = pushFile(newFiles, file)
        return filesToArray({ ...file })
    }

    const onNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files: newFiles } = e.target
        let result: boolean | string = true

        if (beforeUpload) {
            result = beforeUpload(newFiles, files)

            if (result === false) {
                onBeforeUpload?.(false)
                return
            }

            if (typeof result === 'string' && result.length > 0) {
                onBeforeUpload?.(result)
                return
            }
        }

        if (result) {
            const updatedFiles = addNewFiles(newFiles)
            setFiles(updatedFiles)
            if (newFiles && newFiles?.length > 0) {
                onChange?.(newFiles[0], updatedFiles)
            }
        }
    }

    const handleRemoveFile = (fileIndex: number) => {
        const deletedFile = files[fileIndex]
        const newFileList = files.filter((_, index) => index !== fileIndex)
        if (!fileList) {
            setFiles(newFileList)
        }
        onFileRemove?.(deletedFile, newFileList)
    }

    const triggerUpload = (e: MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            fileInputField.current?.click()
        }
        e.stopPropagation()
    }

    const renderChildren = () => {
        if (!draggable && !children) {
            return (
                <Button
                    className={uploadClassNames?.trigger}
                    disabled={disabled}
                    onClick={(e) => e.preventDefault()}
                >
                    Upload
                </Button>
            )
        }

        if (draggable && !children) {
            return (
                <span className={uploadClassNames?.trigger}>
                    Choose a file or drag and drop here
                </span>
            )
        }

        return uploadClassNames?.trigger ? (
            <span className={uploadClassNames.trigger}>{children}</span>
        ) : (
            children
        )
    }

    const handleDragLeave = useCallback(() => {
        if (draggable) {
            setDragOver(false)
        }
    }, [draggable])

    const handleDragOver = useCallback(() => {
        if (draggable && !disabled) {
            setDragOver(true)
        }
    }, [draggable, disabled])

    const handleDrop = useCallback(() => {
        if (draggable) {
            setDragOver(false)
        }
    }, [draggable])

    const draggableProp = {
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
    }

    const draggableEventFeedbackClass = `border-primary`

    const uploadClass = classNames(
        'upload relative inline-flex',
        draggable &&
            `upload-draggable min-h-20 border-2 border-dashed border-input rounded-control cursor-pointer flex items-center justify-center`,
        draggable && 'shadow-control',
        draggable && !disabled && `hover:${draggableEventFeedbackClass}`,
        disabled && 'disabled cursor-not-allowed opacity-60',
        dragOver && draggableEventFeedbackClass,
        uploadClassNames?.root,
        className,
    )

    const uploadInputClass = classNames(
        'upload-input absolute inset-0 hidden bg-control',
        draggable && `draggable block opacity-0 w-full cursor-pointer`,
        disabled && 'cursor-not-allowed',
        uploadClassNames?.input,
    )

    return (
        <div className={classNames('upload-container flex flex-col', uploadClassNames?.root)}>
            <div
                ref={ref}
                className={uploadClass}
                {...(draggable ? draggableProp : { onClick: triggerUpload })}
                {...rest}
            >
                <input
                    ref={fileInputField}
                    className={uploadInputClass}
                    type="file"
                    disabled={disabled}
                    multiple={multiple}
                    accept={accept}
                    title=""
                    value=""
                    onChange={onNewFileUpload}
                    {...rest}
                ></input>
                {renderChildren()}
            </div>
            {tip && uploadClassNames?.tip ? (
                <div className={classNames('upload-tip mt-2', uploadClassNames.tip)}>
                    {tip}
                </div>
            ) : (
                tip
            )}
            {showList && files.length > 0 && (
                <div
                    className={classNames(
                        'upload-file-list mt-4',
                        uploadClassNames?.list,
                        fileListClass,
                    )}
                >
                    {files.map((file, index) => {
                        if (customFileItem) {
                            return (
                                <Fragment key={file.name + index}>
                                    {customFileItem({
                                        file,
                                        onRemove: () => handleRemoveFile(index),
                                        index,
                                        FileIcon,
                                    })}
                                </Fragment>
                            )
                        }

                        return (
                            <FileItem
                                key={file.name + index}
                                file={file}
                                className={fileItemClass}
                                closeButton={
                                    <CloseButton
                                        className={classNames(
                                            'upload-file-remove mx-2',
                                            uploadClassNames?.removeButton,
                                        )}
                                        onClick={() => handleRemoveFile(index)}
                                        aria-label="remove file"
                                    >
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1em"
                                                height="1em"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </span>
                                    </CloseButton>
                                }
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Upload
