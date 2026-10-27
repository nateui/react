import { useLayoutEffect, useState } from 'react'
import { useScrollContext } from '../context'
import useResizeObserver from '../hooks/use-resize-observer'
import useDebouncedCallback from '../hooks/use-debounce-callback'
import ScrollbarVisible from './scrollbar-visible'
import type { ScrollbarVisibleProps } from './scrollbar-visible'

export type ScrollbarAutoProps = ScrollbarVisibleProps & {
    forceMount?: true
}

const ScrollbarAuto = (props: ScrollbarAutoProps) => {
    const context = useScrollContext()
    const {
        forceMount,
        ref,
        'data-state': requestedState,
        ...scrollbarProps
    } = props
    const [visible, setVisible] = useState(false)
    const [initial, setInitial] = useState(true)
    const isHorizontal = props.orientation === 'horizontal'

    const measure = () => {
        if (context.viewport) {
            const isOverflowX =
                context.viewport.offsetWidth < context.viewport.scrollWidth
            const isOverflowY =
                context.viewport.offsetHeight < context.viewport.scrollHeight
            setVisible(isHorizontal ? isOverflowX : isOverflowY)
        }
    }

    const handleResize = useDebouncedCallback(measure, 10)

    useLayoutEffect(() => {
        if (!context.viewport) return

        measure()
        setInitial(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.viewport, isHorizontal])

    useResizeObserver(context.viewport, handleResize)
    useResizeObserver(context.content, handleResize)

    if (forceMount || visible) {
        return (
            <ScrollbarVisible
                data-state={
                    requestedState ?? (visible ? 'visible' : 'hidden')
                }
                data-initial={initial ? 'true' : undefined}
                {...scrollbarProps}
                ref={ref}
            />
        )
    }

    return null
}

export default ScrollbarAuto
