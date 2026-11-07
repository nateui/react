import { useEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import useCallbackRef from '@/hooks/use-callback-ref'
import useMergedRef from '@/hooks/use-merge-ref'
import useResizeObserver from '../hooks/use-resize-observer'
import useDebouncedCallback from '../hooks/use-debounce-callback'
import { useScrollContext } from '../context'
import type { Sizes } from '../types'
import composeEventHandlers from '../utils/compose-event-handlers'
import { ScrollbarProvider } from './context'
import type { ScrollbarContextValue } from './context'
export type BarPrivateProps = {
    sizes: Sizes
    hasThumb: boolean
    onThumbChange: ScrollbarContextValue['onThumbChange']
    onThumbPointerUp: ScrollbarContextValue['onThumbPointerUp']
    onThumbPointerDown: ScrollbarContextValue['onThumbPointerDown']
    onThumbPositionChange: ScrollbarContextValue['onThumbPositionChange']
    onWheelScroll: (event: WheelEvent, maxScrollPos: number) => void
    onDragScroll: (pointerPos: { x: number; y: number }) => void
    onResize: () => void
}

export type BarProps = BarPrivateProps & Omit<React.ComponentPropsWithoutRef<'div'>, 'onResize'> & {
    ref?: React.Ref<HTMLDivElement>
}

function Bar({
    ref: forwardedRef,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    ...scrollbarProps
}: BarProps) {
    const context = useScrollContext()
    const [scrollbar, setScrollbar] = useState<HTMLDivElement | null>(null)
    const [dragging, setDragging] = useState(false)
    const composeRefs = useMergedRef(
        forwardedRef ?? null,
        (node: SetStateAction<HTMLDivElement | null>) => setScrollbar(node),
    )
    const rectRef = useRef<DOMRect | null>(null)
    const prevWebkitUserSelectRef = useRef<string>('')
    const { viewport } = context
    const maxScrollPos = sizes.content - sizes.viewport
    const handleWheelScroll = useCallbackRef(onWheelScroll)
    const handleThumbPositionChange = useCallbackRef(onThumbPositionChange)
    const handleResize = useDebouncedCallback(onResize, 10)

    const handleDragScroll = (event: React.PointerEvent<HTMLElement>) => {
        if (rectRef.current) {
            const x = event.clientX - rectRef.current.left
            const y = event.clientY - rectRef.current.top
            onDragScroll({ x, y })
        }
    }

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const element = event.target as HTMLElement
            const isScrollbarWheel = scrollbar?.contains(element)
            if (isScrollbarWheel) {
                handleWheelScroll(event, maxScrollPos)
            }
        }
        document.addEventListener('wheel', handleWheel, { passive: false })

        return () =>
            document.removeEventListener('wheel', handleWheel, {
                passive: false,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll])

    useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange])

    useResizeObserver(scrollbar, handleResize)
    useResizeObserver(context.content, handleResize)

    return (
        <ScrollbarProvider
            value={{
                scrollbar,
                hasThumb,
                onThumbChange: useCallbackRef(onThumbChange),
                onThumbPointerUp: useCallbackRef(onThumbPointerUp),
                onThumbPositionChange: handleThumbPositionChange,
                onThumbPointerDown: useCallbackRef(onThumbPointerDown),
            }}
        >
            <div
                {...scrollbarProps}
                ref={composeRefs}
                data-dragging={dragging ? true : undefined}
                data-overflow={hasThumb ? 'true' : 'false'}
                style={{ position: 'absolute', ...scrollbarProps.style }}
                onPointerDown={composeEventHandlers(onPointerDown, (event) => {
                    if (!hasThumb) return

                    event.preventDefault()

                    const mainPointer = 0
                    if (event.button === mainPointer) {
                        setDragging(true)
                        const element = event.target as HTMLElement
                        element.setPointerCapture(event.pointerId)
                        rectRef.current = scrollbar!.getBoundingClientRect()
                        prevWebkitUserSelectRef.current =
                            document.body.style.webkitUserSelect

                        document.body.style.webkitUserSelect = 'none'
                        handleDragScroll(event)
                    }
                })}
                onPointerMove={composeEventHandlers(
                    onPointerMove,
                    handleDragScroll,
                )}
                onPointerUp={composeEventHandlers(onPointerUp, (event) => {
                    setDragging(false)
                    const element = event.target as HTMLElement
                    if (element.hasPointerCapture(event.pointerId)) {
                        event.preventDefault()
                        element.releasePointerCapture(event.pointerId)
                    }
                })}
                onLostPointerCapture={() => {
                    setDragging(false)
                    document.body.style.webkitUserSelect =
                        prevWebkitUserSelectRef.current
                    rectRef.current = null
                }}
            />
        </ScrollbarProvider>
    )
}

export default Bar
