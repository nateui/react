import type {
    ComponentPropsWithoutRef,
    CSSProperties,
    ElementType,
    PointerEvent as ReactPointerEvent,
    ReactNode,
    Ref,
} from 'react'

export type ResizeDirection =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'topRight'
    | 'bottomRight'
    | 'bottomLeft'
    | 'topLeft'

export type Enable = Partial<Record<ResizeDirection, boolean>>

export type HandleStyles = Partial<Record<ResizeDirection, CSSProperties>>

export type HandleClassNames = Partial<Record<ResizeDirection, string>>

export type HandleComponents = Partial<Record<ResizeDirection, ReactNode>>

export type ResizeHandleConfig = {
    position: ResizeDirection
    handler?: false | ReactNode
}

export type ResizableClassNames = Partial<
    Record<
        | 'root'
        | 'handleWrapper'
        | 'top'
        | 'right'
        | 'bottom'
        | 'left'
        | 'topRight'
        | 'bottomRight'
        | 'bottomLeft'
        | 'topLeft',
        string
    >
>

export type SizeValue = string | number

export type Size = {
    width?: SizeValue
    height?: SizeValue
}

export type NumberSize = {
    width: number
    height: number
}

export type ResizeCallback = (
    event: PointerEvent,
    direction: ResizeDirection,
    elementRef: HTMLElement,
    delta: NumberSize,
) => void

export type ResizeStartCallback = (
    event: ReactPointerEvent<HTMLElement>,
    direction: ResizeDirection,
    elementRef: HTMLElement,
) => void | boolean

export type ResizableOwnProps<E extends ElementType = 'div'> = {
    asElement?: E
    bounds?: 'parent' | 'window' | HTMLElement
    boundsByDirection?: boolean
    children?: ReactNode
    className?: string
    classNames?: ResizableClassNames
    defaultSize?: Size
    disabled?: boolean
    enable?: Enable | false
    grid?: [number, number]
    gridGap?: [number, number]
    handles?: false | ResizeHandleConfig[]
    handleClasses?: HandleClassNames
    handleClassNames?: HandleClassNames
    handleComponent?: HandleComponents
    handleComponents?: HandleComponents
    handleStyles?: HandleStyles
    handleWrapperClass?: string
    handleWrapperClassName?: string
    handleWrapperStyle?: CSSProperties
    lockAspectRatio?: boolean | number
    lockAspectRatioExtraHeight?: number
    lockAspectRatioExtraWidth?: number
    maxHeight?: SizeValue
    maxWidth?: SizeValue
    minHeight?: SizeValue
    minWidth?: SizeValue
    onResize?: ResizeCallback
    onResizeStart?: ResizeStartCallback
    onResizeStop?: ResizeCallback
    ref?: Ref<HTMLElement>
    resizeRatio?: number | [number, number]
    scale?: number
    size?: Size
    snap?: {
        x?: number[]
        y?: number[]
    }
    snapGap?: number
    style?: CSSProperties
}

export type ResizableProps<E extends ElementType = 'div'> =
    ResizableOwnProps<E> &
        Omit<
            ComponentPropsWithoutRef<E>,
            keyof ResizableOwnProps<E> | 'onResize' | 'children'
        >
