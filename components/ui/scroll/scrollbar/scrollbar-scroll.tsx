import { useEffect, useState } from 'react'
import useDebouncedCallback from '../hooks/use-debounce-callback'
import { useScrollContext } from '../context'
import composeEventHandlers from '../utils/compose-event-handlers'
import ScrollbarVisible from './scrollbar-visible'
import type { ScrollbarVisibleProps } from './scrollbar-visible'

export type ScrollbarScrollProps = ScrollbarVisibleProps & {
    forceMount?: true
}

const ScrollbarScroll = (props: ScrollbarScrollProps) => {
    const { forceMount, ref, ...scrollbarProps } = props
    const context = useScrollContext()
    const isHorizontal = props.orientation === 'horizontal'
    const [state, setState] = useState<
        'hidden' | 'idle' | 'interacting' | 'scrolling'
    >('hidden')
    const debounceScrollEnd = useDebouncedCallback(() => setState('idle'), 100)

    useEffect(() => {
        if (state === 'idle') {
            const hideTimer = window.setTimeout(
                () => setState('hidden'),
                context.scrollHideDelay,
            )
            return () => window.clearTimeout(hideTimer)
        }

        return undefined
    }, [state, context.scrollHideDelay])

    useEffect(() => {
        const { viewport } = context
        const scrollDirection = isHorizontal ? 'scrollLeft' : 'scrollTop'

        if (viewport) {
            let prevScrollPos = viewport[scrollDirection]
            const handleScroll = () => {
                const scrollPos = viewport[scrollDirection]
                const hasScrollInDirectionChanged = prevScrollPos !== scrollPos
                if (hasScrollInDirectionChanged) {
                    setState('scrolling')
                    debounceScrollEnd()
                }
                prevScrollPos = scrollPos
            }
            viewport.addEventListener('scroll', handleScroll)
            return () => viewport.removeEventListener('scroll', handleScroll)
        }

        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.viewport, isHorizontal, debounceScrollEnd])

    if (forceMount || state !== 'hidden') {
        return (
            <ScrollbarVisible
                {...scrollbarProps}
                ref={ref}
                data-state={state}
                onPointerEnter={composeEventHandlers(props.onPointerEnter, () =>
                    setState('interacting'),
                )}
                onPointerLeave={composeEventHandlers(props.onPointerLeave, () =>
                    setState('idle'),
                )}
            />
        )
    }

    return null
}

export default ScrollbarScroll
