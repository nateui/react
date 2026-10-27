import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import useMergeRef from '@/hooks/use-merge-ref'
import { useConfig } from '../config-provider/index'
import ResizableHandle from './resizable-handle'
import {
    clamp,
    defaultEnable,
    defaultSize,
    directions,
    findClosestSnap,
    hasDirection,
    isAuto,
    normalizePair,
    snapToGrid,
    toCssSize,
    toPixelSize,
} from './utils'
import type {
    CSSProperties,
    ElementType,
    PointerEvent as ReactPointerEvent,
} from 'react'
import type {
    NumberSize,
    ResizeHandleConfig,
    ResizeDirection,
    ResizableProps,
    Size,
    SizeValue,
} from './types'

type DragState = {
    cursor: string
    direction: ResizeDirection
    original: {
        x: number
        y: number
        width: number
        height: number
    }
    sizeAtStart: Required<Size>
    rectAtStart: DOMRect
    parentRect?: DOMRect
    boundsRect?: DOMRect
    ratio: number
}

type ResolvedHandle = {
    direction: ResizeDirection
    handler?: ResizeHandleConfig['handler']
}

function getSizeFromProps(
    size?: Size,
    fallback: Size = defaultSize,
): Required<Size> {
    return {
        width: size?.width ?? fallback.width ?? 'auto',
        height: size?.height ?? fallback.height ?? 'auto',
    }
}

function createCssSize(
    nextValue: number,
    initialValue: SizeValue,
    originalValue: number,
    propValue: SizeValue | undefined,
) {
    if (
        isAuto(initialValue) &&
        isAuto(propValue) &&
        nextValue === originalValue
    ) {
        return 'auto'
    }

    return nextValue
}

function getElementWindow(element: HTMLElement) {
    return element.ownerDocument.defaultView ?? window
}

function Resizable<E extends ElementType = 'div'>(props: ResizableProps<E>) {
    const {
        asElement,
        bounds,
        boundsByDirection = false,
        children,
        className,
        classNames: slotClassNames,
        defaultSize: defaultSizeProp,
        disabled = false,
        enable = defaultEnable,
        grid = [1, 1],
        gridGap = [0, 0],
        handles,
        handleClasses,
        handleClassNames,
        handleComponent,
        handleComponents,
        handleStyles,
        handleWrapperClass,
        handleWrapperClassName,
        handleWrapperStyle,
        lockAspectRatio = false,
        lockAspectRatioExtraHeight = 0,
        lockAspectRatioExtraWidth = 0,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        onResize,
        onResizeStart,
        onResizeStop,
        ref,
        resizeRatio = 1,
        scale = 1,
        size,
        snap,
        snapGap = 0,
        style,
        ...rest
    } = props

    const { classNames: configClassNames } = useConfig()
    const resizableClassNames = configClassNames?.resizable
    const elementRef = useRef<HTMLElement | null>(null)
    const mergedRef = useMergeRef<HTMLElement | null>(
        ref ?? null,
        (element: HTMLElement | null) => {
            elementRef.current = element
        },
    )
    const initialDefaultSize = useRef(defaultSizeProp ?? defaultSize)
    const [liveSize, setLiveSize] = useState<Required<Size>>(() =>
        getSizeFromProps(size, initialDefaultSize.current),
    )
    const [drag, setDrag] = useState<DragState | null>(null)

    const isControlled = size !== undefined
    const renderedSize = isControlled && !drag ? getSizeFromProps(size) : liveSize
    const Component = (asElement ?? 'div') as ElementType

    useEffect(() => {
        if (!drag && isControlled) {
            setLiveSize(getSizeFromProps(size))
        }
    }, [drag, isControlled, size])

    const handleResizeStart = useCallback(
        (
            event: ReactPointerEvent<HTMLElement>,
            direction: ResizeDirection,
        ) => {
            if (disabled || event.button !== 0) {
                return
            }

            const element = elementRef.current
            if (!element) {
                return
            }

            const startResize = onResizeStart?.(event, direction, element)
            if (startResize === false) {
                return
            }

            event.preventDefault()
            event.stopPropagation()

            const ownerWindow = getElementWindow(element)
            const computedStyle = ownerWindow.getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            const parentRect = element.parentElement?.getBoundingClientRect()
            const boundsRect =
                bounds && typeof bounds !== 'string'
                    ? bounds.getBoundingClientRect()
                    : undefined

            const width = isControlled
                ? size?.width ?? liveSize.width
                : liveSize.width
            const height = isControlled
                ? size?.height ?? liveSize.height
                : liveSize.height

            setDrag({
                boundsRect,
                cursor: computedStyle.cursor || 'auto',
                direction,
                original: {
                    x: event.clientX,
                    y: event.clientY,
                    width: rect.width,
                    height: rect.height,
                },
                parentRect,
                ratio:
                    typeof lockAspectRatio === 'number'
                        ? lockAspectRatio
                        : rect.height > 0
                          ? rect.width / rect.height
                          : 1,
                rectAtStart: rect,
                sizeAtStart: {
                    width,
                    height,
                },
            })
            setLiveSize({ width, height })
        },
        [
            bounds,
            disabled,
            isControlled,
            liveSize.height,
            liveSize.width,
            lockAspectRatio,
            onResizeStart,
            size?.height,
            size?.width,
        ],
    )

    useEffect(() => {
        if (!drag) {
            return
        }

        const element = elementRef.current
        if (!element) {
            return
        }

        const ownerWindow = getElementWindow(element)
        const ownerDocument = element.ownerDocument
        const body = ownerDocument.body
        const previousCursor = body.style.cursor
        const previousUserSelect = body.style.userSelect
        const previousWebkitUserSelect = body.style.webkitUserSelect

        body.style.cursor = drag.cursor
        body.style.userSelect = 'none'
        body.style.webkitUserSelect = 'none'

        const getParentSize = () => {
            const parent = element.parentElement

            if (!parent) {
                return {
                    width: ownerWindow.innerWidth,
                    height: ownerWindow.innerHeight,
                }
            }

            return {
                width: parent.clientWidth,
                height: parent.clientHeight,
            }
        }

        const getBoundsMax = () => {
            if (!bounds) {
                return {}
            }

            const rect =
                bounds === 'parent'
                    ? drag.parentRect
                    : bounds === 'window'
                      ? new DOMRect(
                            0,
                            0,
                            ownerWindow.innerWidth,
                            ownerWindow.innerHeight,
                        )
                      : drag.boundsRect

            if (!rect) {
                return {}
            }

            const resizingLeft = hasDirection(drag.direction, 'left')
            const resizingRight = hasDirection(drag.direction, 'right')
            const resizingTop = hasDirection(drag.direction, 'top')
            const resizingBottom = hasDirection(drag.direction, 'bottom')

            return {
                maxWidth:
                    boundsByDirection && resizingLeft
                        ? drag.rectAtStart.right - rect.left
                        : resizingRight
                          ? rect.right - drag.rectAtStart.left
                          : undefined,
                maxHeight:
                    boundsByDirection && resizingTop
                        ? drag.rectAtStart.bottom - rect.top
                        : resizingBottom
                          ? rect.bottom - drag.rectAtStart.top
                          : undefined,
            }
        }

        const handlePointerMove = (event: PointerEvent) => {
            event.preventDefault()

            const [resizeRatioX, resizeRatioY] = normalizePair(resizeRatio)
            const parentSize = getParentSize()
            const viewport = {
                width: ownerWindow.innerWidth,
                height: ownerWindow.innerHeight,
            }
            const scaleValue = scale || 1
            const deltaX =
                ((event.clientX - drag.original.x) * resizeRatioX) / scaleValue
            const deltaY =
                ((event.clientY - drag.original.y) * resizeRatioY) / scaleValue
            const resizingLeft = hasDirection(drag.direction, 'left')
            const resizingRight = hasDirection(drag.direction, 'right')
            const resizingTop = hasDirection(drag.direction, 'top')
            const resizingBottom = hasDirection(drag.direction, 'bottom')

            let nextWidth = drag.original.width
            let nextHeight = drag.original.height

            if (resizingRight) {
                nextWidth = drag.original.width + deltaX
            }

            if (resizingLeft) {
                nextWidth = drag.original.width - deltaX
            }

            if (resizingBottom) {
                nextHeight = drag.original.height + deltaY
            }

            if (resizingTop) {
                nextHeight = drag.original.height - deltaY
            }

            if (lockAspectRatio) {
                if (resizingLeft || resizingRight) {
                    nextHeight =
                        (nextWidth - lockAspectRatioExtraWidth) / drag.ratio +
                        lockAspectRatioExtraHeight
                } else if (resizingTop || resizingBottom) {
                    nextWidth =
                        (nextHeight - lockAspectRatioExtraHeight) * drag.ratio +
                        lockAspectRatioExtraWidth
                }
            }

            if (snap?.x) {
                nextWidth = findClosestSnap(nextWidth, snap.x, snapGap)
            }

            if (snap?.y) {
                nextHeight = findClosestSnap(nextHeight, snap.y, snapGap)
            }

            if (grid) {
                const snappedWidth = snapToGrid(
                    nextWidth,
                    grid[0],
                    gridGap?.[0] ?? 0,
                )
                const snappedHeight = snapToGrid(
                    nextHeight,
                    grid[1],
                    gridGap?.[1] ?? 0,
                )

                nextWidth =
                    snapGap === 0 ||
                    Math.abs(snappedWidth - nextWidth) <= snapGap
                        ? snappedWidth
                        : nextWidth
                nextHeight =
                    snapGap === 0 ||
                    Math.abs(snappedHeight - nextHeight) <= snapGap
                        ? snappedHeight
                        : nextHeight
            }

            const minWidthPx = toPixelSize(minWidth, parentSize.width, viewport)
            const minHeightPx = toPixelSize(minHeight, parentSize.height, viewport)
            const maxWidthPx = toPixelSize(maxWidth, parentSize.width, viewport)
            const maxHeightPx = toPixelSize(maxHeight, parentSize.height, viewport)
            const boundsMax = getBoundsMax()

            nextWidth = clamp(
                nextWidth,
                minWidthPx ?? 10,
                Math.min(
                    maxWidthPx ?? Number.POSITIVE_INFINITY,
                    boundsMax.maxWidth ?? Number.POSITIVE_INFINITY,
                ),
            )
            nextHeight = clamp(
                nextHeight,
                minHeightPx ?? 10,
                Math.min(
                    maxHeightPx ?? Number.POSITIVE_INFINITY,
                    boundsMax.maxHeight ?? Number.POSITIVE_INFINITY,
                ),
            )

            const nextSize: Required<Size> = {
                width: createCssSize(
                    nextWidth,
                    drag.sizeAtStart.width,
                    drag.original.width,
                    size?.width,
                ),
                height: createCssSize(
                    nextHeight,
                    drag.sizeAtStart.height,
                    drag.original.height,
                    size?.height,
                ),
            }
            const delta: NumberSize = {
                width: nextWidth - drag.original.width,
                height: nextHeight - drag.original.height,
            }

            setLiveSize(nextSize)
            onResize?.(event, drag.direction, element, delta)
        }

        const handlePointerUp = (event: PointerEvent) => {
            const width = element.offsetWidth
            const height = element.offsetHeight
            const delta: NumberSize = {
                width: width - drag.original.width,
                height: height - drag.original.height,
            }

            onResizeStop?.(event, drag.direction, element, delta)
            setDrag(null)

            if (isControlled) {
                setLiveSize(getSizeFromProps(size))
            }
        }

        ownerWindow.addEventListener('pointermove', handlePointerMove)
        ownerWindow.addEventListener('pointerup', handlePointerUp, { once: true })
        ownerWindow.addEventListener('pointercancel', handlePointerUp, {
            once: true,
        })

        return () => {
            body.style.cursor = previousCursor
            body.style.userSelect = previousUserSelect
            body.style.webkitUserSelect = previousWebkitUserSelect
            ownerWindow.removeEventListener('pointermove', handlePointerMove)
            ownerWindow.removeEventListener('pointerup', handlePointerUp)
            ownerWindow.removeEventListener('pointercancel', handlePointerUp)
        }
    }, [
        bounds,
        boundsByDirection,
        drag,
        grid,
        gridGap,
        isControlled,
        lockAspectRatio,
        lockAspectRatioExtraHeight,
        lockAspectRatioExtraWidth,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        onResize,
        onResizeStop,
        resizeRatio,
        scale,
        size,
        snap,
        snapGap,
    ])

    const rootStyle = useMemo<CSSProperties>(
        () => ({
            position: 'relative',
            userSelect: drag ? 'none' : undefined,
            ...style,
            width: toCssSize(renderedSize.width),
            height: toCssSize(renderedSize.height),
            minWidth: toCssSize(minWidth),
            minHeight: toCssSize(minHeight),
            maxWidth: toCssSize(maxWidth),
            maxHeight: toCssSize(maxHeight),
            boxSizing: 'border-box',
            flexShrink: 0,
        }),
        [
            drag,
            maxHeight,
            maxWidth,
            minHeight,
            minWidth,
            renderedSize.height,
            renderedSize.width,
            style,
        ],
    )

    const resolvedHandleClassNames = handleClassNames ?? handleClasses
    const resolvedHandleComponents = handleComponents ?? handleComponent

    const resolvedHandles = useMemo<ResolvedHandle[]>(() => {
        if (handles !== undefined) {
            if (!handles) {
                return []
            }

            const handleMap = new Map<
                ResizeDirection,
                ResizeHandleConfig['handler']
            >()

            handles.forEach(({ position, handler }) => {
                handleMap.set(position, handler)
            })

            return directions.reduce<ResolvedHandle[]>((list, direction) => {
                if (!handleMap.has(direction)) {
                    return list
                }

                const handler = handleMap.get(direction)

                if (handler === false) {
                    return list
                }

                list.push({ direction, handler })
                return list
            }, [])
        }

        if (!enable) {
            return []
        }

        const configuredDirections =
            enable === defaultEnable
                ? directions
                : directions.filter((direction) =>
                      Object.prototype.hasOwnProperty.call(enable, direction),
                  )

        return configuredDirections
            .filter((direction) => enable[direction] !== false)
            .map((direction) => ({
                direction,
                handler: resolvedHandleComponents?.[direction],
            }))
    }, [enable, handles, resolvedHandleComponents])

    return (
        <Component
            {...rest}
            ref={mergedRef}
            className={classNames(
                resizableClassNames?.root,
                slotClassNames?.root,
                className,
            )}
            data-resizing={drag ? '' : undefined}
            style={rootStyle}
        >
            {drag && (
                <div
                    aria-hidden="true"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        bottom: 0,
                        cursor: drag.cursor,
                        height: '100%',
                        left: 0,
                        opacity: 0,
                        position: 'fixed',
                        right: 0,
                        top: 0,
                        width: '100%',
                        zIndex: 9999,
                    }}
                />
            )}
            {children}
            {resolvedHandles.length > 0 && (
                <div
                    className={classNames(
                        resizableClassNames?.handleWrapper,
                        slotClassNames?.handleWrapper,
                        handleWrapperClassName,
                        handleWrapperClass,
                    )}
                    style={handleWrapperStyle}
                >
                    {resolvedHandles.map(({ direction, handler }) => (
                        <ResizableHandle
                            key={direction}
                            className={classNames(
                                resizableClassNames?.[direction],
                                slotClassNames?.[direction],
                                resolvedHandleClassNames?.[direction],
                            )}
                            direction={direction}
                            disabled={disabled}
                            style={handleStyles?.[direction]}
                            onResizeStart={handleResizeStart}
                        >
                            {handler ?? null}
                        </ResizableHandle>
                    ))}
                </div>
            )}
        </Component>
    )
}

export default Resizable
