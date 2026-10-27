import { memo, useMemo } from 'react'
import type {
    CSSProperties,
    PointerEvent as ReactPointerEvent,
    ReactNode,
} from 'react'
import type { ResizeDirection } from './types'

const rowBase = {
    width: '100%',
    height: '10px',
    left: '0px',
    cursor: 'row-resize',
} satisfies CSSProperties

const columnBase = {
    width: '10px',
    height: '100%',
    top: '0px',
    cursor: 'col-resize',
} satisfies CSSProperties

const cornerBase = {
    width: '20px',
    height: '20px',
    position: 'absolute',
    zIndex: 1,
} satisfies CSSProperties

const handleStyles: Record<ResizeDirection, CSSProperties> = {
    top: {
        ...rowBase,
        top: '-5px',
    },
    right: {
        ...columnBase,
        right: '-5px',
    },
    bottom: {
        ...rowBase,
        bottom: '-5px',
    },
    left: {
        ...columnBase,
        left: '-5px',
    },
    topRight: {
        ...cornerBase,
        right: '-10px',
        top: '-10px',
        cursor: 'ne-resize',
    },
    bottomRight: {
        ...cornerBase,
        right: '-10px',
        bottom: '-10px',
        cursor: 'se-resize',
    },
    bottomLeft: {
        ...cornerBase,
        left: '-10px',
        bottom: '-10px',
        cursor: 'sw-resize',
    },
    topLeft: {
        ...cornerBase,
        left: '-10px',
        top: '-10px',
        cursor: 'nw-resize',
    },
}

function DefaultHandleGrip() {
    return (
        <span
            className="pointer-events-none absolute left-1/2 top-1/2 z-[1] size-3 -translate-x-1/2 -translate-y-1/2 rounded-[2px] border bg-card shadow-card"
        />
    )
}

export type ResizableHandleProps = {
    children?: ReactNode
    className?: string
    direction: ResizeDirection
    disabled?: boolean
    onResizeStart: (
        event: ReactPointerEvent<HTMLElement>,
        direction: ResizeDirection,
    ) => void
    style?: CSSProperties
}

function ResizableHandle({
    children,
    className,
    direction,
    disabled,
    onResizeStart,
    style,
}: ResizableHandleProps) {
    const resolvedStyle = useMemo<CSSProperties>(
        () => ({
            position: 'absolute',
            touchAction: 'none',
            userSelect: 'none',
            ...handleStyles[direction],
            ...style,
        }),
        [direction, style],
    )

    return (
        <div
            aria-hidden="true"
            className={className}
            data-disabled={disabled ? '' : undefined}
            data-resize-handle={direction}
            role="presentation"
            style={resolvedStyle}
            onPointerDown={
                disabled
                    ? undefined
                    : (event) => onResizeStart(event, direction)
            }
        >
            {children ?? <DefaultHandleGrip />}
        </div>
    )
}

export default memo(ResizableHandle)
