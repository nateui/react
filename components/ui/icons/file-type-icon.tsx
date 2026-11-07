export type FileTypeIconProps = {
    type: string
    size?: number
}

type FilePreviewIcon = 'image' | 'video' | 'audio'

type FileLabel = {
    label: string
    color: string
    previewIcon?: FilePreviewIcon
}

const fileLabelMap: Record<string, FileLabel> = {
    file: { label: 'FILE', color: 'var(--color-muted)' },
    pdf: { label: 'PDF', color: '#d61316' },
    xlsx: { label: 'XLS', color: '#217346' },
    xls: { label: 'XLS', color: '#217346' },
    csv: { label: 'CSV', color: '#217346' },
    doc: { label: 'DOC', color: '#2b579a' },
    docx: { label: 'DOC', color: '#2b579a' },
    ppt: { label: 'PPT', color: '#d24726' },
    pptx: { label: 'PPT', color: '#d24726' },
    jpg: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    jpeg: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    png: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    gif: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    webp: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    svg: { label: 'IMG', color: '#8361cd', previewIcon: 'image' },
    mp4: { label: 'VID', color: '#eb4137', previewIcon: 'video' },
    mov: { label: 'VID', color: '#eb4137', previewIcon: 'video' },
    webm: { label: 'VID', color: '#eb4137', previewIcon: 'video' },
    video: { label: 'VID', color: '#eb4137', previewIcon: 'video' },
    mp3: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    m4a: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    wav: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    aac: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    flac: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    ogg: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    oga: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    opus: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    mpeg: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    audio: { label: 'AUD', color: '#286cf0', previewIcon: 'audio' },
    zip: { label: 'ZIP', color: '#535862' },
    rar: { label: 'RAR', color: '#535862' },
    '7z': { label: 'ZIP', color: '#535862' },
    txt: { label: 'TXT', color: '#535862' },
}

const renderPreviewIcon = (icon: FilePreviewIcon, color: string) => {
    if (icon === 'image') {
        return (
            <g transform="translate(10 15)">
                <path
                    d="M0.152334 14.068L5.47451 4.65461C5.94195 3.82786 7.1725 3.82786 7.63991 4.65461L11.5477 11.5664L12.8862 9.30672C13.3596 8.5074 14.5542 8.5074 15.0277 9.30672L17.8357 14.0476C18.3055 14.8407 17.7118 15.8276 16.7649 15.8276H1.23502C0.298885 15.8276 -0.29594 14.8609 0.152334 14.068Z"
                    fill={color}
                />
                <path
                    d="M16.4484 2.32759C16.4484 3.61308 15.4063 4.65517 14.1208 4.65517C12.8353 4.65517 11.7932 3.61308 11.7932 2.32759C11.7932 1.0421 12.8353 0 14.1208 0C15.4063 0 16.4484 1.0421 16.4484 2.32759Z"
                    fill={color}
                />
            </g>
        )
    }

    if (icon === 'audio') {
        return (
            <g transform="translate(11, 16) scale(0.91)">
                <path
                    d="M4.63155 4.13545V13.3832C4.24959 13.2772 3.84239 13.1975 3.48649 13.1975C2.67208 13.1975 1.83242 13.4892 1.14506 13.9657C0.457698 14.4423 0 15.2114 0 16.1119C0 17.0658 0.458513 17.7815 1.14506 18.258C1.83161 18.7346 2.67208 19 3.48649 19C4.25041 19 5.11531 18.7346 5.80267 18.258C6.49004 17.7815 6.92249 17.0658 6.92249 16.1119V6.41304L14.6846 4.10747V10.4934C14.3279 10.3874 13.8955 10.334 13.5135 10.334C12.7243 10.334 11.8594 10.5722 11.1721 11.0496C10.4847 11.527 10.0523 12.2953 10.0523 13.1958C10.0523 14.1497 10.4847 14.8917 11.1721 15.3419C11.8594 15.8193 12.7243 16.1102 13.5135 16.1102C14.2774 16.1102 15.1676 15.8185 15.8549 15.3419C16.5675 14.8917 17 14.1497 17 13.1958V0.98023C17 0.39684 16.618 0 16.0585 0C16.0072 0 15.7018 0.105994 15.2189 0.238274C14.2009 0.529968 12.6739 0.98023 10.9432 1.5102C10.0523 1.74847 9.2631 2.01388 8.47475 2.22587C7.71084 2.46414 7.04954 2.70326 6.46397 2.86183C5.85317 3.04753 5.47121 3.15352 5.31891 3.2061C4.91171 3.33838 4.63155 3.70978 4.63155 4.13375V4.13545Z"
                    fill={color}
                />
            </g>
        )
    }

    return (
        <g transform="translate(11 15)">
            <path
                d="M9 0C4.032 0 0 4.032 0 9C0 13.968 4.032 18 9 18C13.968 18 18 13.968 18 9C18 4.032 13.968 0 9 0ZM11.394 10.557L10.242 11.223L9.09 11.889C7.605 12.744 6.39 12.042 6.39 10.332V9V7.668C6.39 5.949 7.605 5.256 9.09 6.111L10.242 6.777L11.394 7.443C12.879 8.298 12.879 9.702 11.394 10.557Z"
                fill={color}
            />
        </g>
    )
}

const FileTypeIcon = ({ type, size = 32 }: FileTypeIconProps) => {
    const normalizedType = type.toLowerCase().replace(/^\./, '')
    const fileLabel = fileLabelMap[normalizedType] ?? {
        label: normalizedType.slice(0, 3).toUpperCase() || 'FILE',
        color: 'var(--color-muted)',
    }

    if (normalizedType === 'directory') {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width={size}
                height={size}
            >
                <path
                    className="fill-muted stroke-gray-300 dark:stroke-gray-700 stroke-[1.5px]"
                    d="M3.75 10A3.25 3.25 0 0 1 7 6.75h8.4c.86 0 1.68.34 2.3.95l2.05 2.05H33A3.25 3.25 0 0 1 36.25 13v17A3.25 3.25 0 0 1 33 33.25H7A3.25 3.25 0 0 1 3.75 30z"
                />
            </svg>
        )
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            width={size}
            height={size}
        >
            <path
                className="fill-card stroke-gray-300 dark:stroke-gray-700 stroke-[1.5px]"
                d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
            />
            <path
                className="fill-card stroke-gray-300 dark:stroke-gray-700 stroke-[1.5px]"
                d="M24 .5V8a4 4 0 0 0 4 4h7.5"
            />
            {fileLabel.previewIcon ? (
                renderPreviewIcon(fileLabel.previewIcon, fileLabel.color)
            ) : (
                <foreignObject width={27} height={14} x={0} y={20}>
                    <div
                        style={{
                            alignItems: 'center',
                            backgroundColor: fileLabel.color,
                            borderRadius: 2,
                            color: '#fff',
                            display: 'flex',
                            fontSize: 8,
                            fontWeight: 700,
                            height: '100%',
                            justifyContent: 'center',
                            lineHeight: 1,
                            userSelect: 'none',
                            width: '100%',
                        }}
                    >
                        {fileLabel.label}
                    </div>
                </foreignObject>
            )}
        </svg>
    )
}

export default FileTypeIcon
