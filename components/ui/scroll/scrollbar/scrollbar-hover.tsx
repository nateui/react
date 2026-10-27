import { useEffect, useState } from 'react'
import { useScrollContext } from '../context'
import ScrollbarAuto from './scrollbar-auto'
import type { ScrollbarAutoProps } from './scrollbar-auto'

export type ScrollbarHoverProps = ScrollbarAutoProps & {
    forceMount?: true
}

const ScrollAreaScrollbarHover = (props: ScrollbarHoverProps) => {
    const { forceMount, ref, ...scrollbarProps } = props
    const context = useScrollContext()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const { scrollArea, viewport } = context
        let hideTimer = 0
        let focused = false

        const clearHideTimer = () => window.clearTimeout(hideTimer)
        const show = () => {
            clearHideTimer()
            setVisible(true)
        }
        const scheduleHide = () => {
            clearHideTimer()
            if (focused) return

            hideTimer = window.setTimeout(
                () => setVisible(false),
                Math.max(0, context.scrollHideDelay),
            )
        }

        const handlePointerLeave = () => {
            clearHideTimer()
            if (!focused) setVisible(false)
        }
        const handleFocusIn = () => {
            focused = true
            show()
        }
        const handleFocusOut = (event: FocusEvent) => {
            if (
                scrollArea &&
                event.relatedTarget instanceof Node &&
                scrollArea.contains(event.relatedTarget)
            ) {
                return
            }

            focused = false
            scheduleHide()
        }
        const handleScroll = () => {
            show()
            scheduleHide()
        }

        if (scrollArea) {
            scrollArea.addEventListener('pointerleave', handlePointerLeave)
            scrollArea.addEventListener('focusin', handleFocusIn)
            scrollArea.addEventListener('focusout', handleFocusOut)
        }
        viewport?.addEventListener('scroll', handleScroll)

        return () => {
            clearHideTimer()
            scrollArea?.removeEventListener(
                'pointerleave',
                handlePointerLeave,
            )
            scrollArea?.removeEventListener('focusin', handleFocusIn)
            scrollArea?.removeEventListener('focusout', handleFocusOut)
            viewport?.removeEventListener('scroll', handleScroll)
        }
    }, [
        context.scrollArea,
        context.scrollHideDelay,
        context.viewport,
    ])

    return (
        <ScrollbarAuto
            {...scrollbarProps}
            ref={ref}
            forceMount={forceMount}
            data-state={visible ? 'visible' : 'hidden'}
        />
    )
}

export default ScrollAreaScrollbarHover
