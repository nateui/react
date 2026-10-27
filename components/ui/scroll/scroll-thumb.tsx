import { useEffect, useRef } from 'react'
import useMergedRef from '@/hooks/use-merge-ref'
import useDebouncedCallback from './hooks/use-debounce-callback'
import { useScrollContext } from './context'
import { useScrollbarContext } from './scrollbar/context'
import addUnlinkedScrollListener from './utils/add-unlinked-scroll-listener'
import composeEventHandlers from './utils/compose-event-handlers'
import type { ComponentProps, Ref } from 'react'

type ThumbProps = ComponentProps<'div'> & {
    ref?: Ref<HTMLDivElement>
}

export const Thumb = (props: ThumbProps) => {
    const { style, ref: forwardedRef = null, ...rest } = props
    const scrollAreaContext = useScrollContext()
    const scrollbarContext = useScrollbarContext()
    const { onThumbPositionChange } = scrollbarContext
    const composedRef = useMergedRef(
        forwardedRef,
        (node: HTMLDivElement | null) => scrollbarContext.onThumbChange(node),
    )
    const removeUnlinkedScrollListenerRef = useRef<(() => void) | undefined>(
        undefined,
    )

    const debounceScrollEnd = useDebouncedCallback(() => {
        if (removeUnlinkedScrollListenerRef.current) {
            removeUnlinkedScrollListenerRef.current()
            removeUnlinkedScrollListenerRef.current = undefined
        }
    }, 100)

    useEffect(() => {
        const { viewport } = scrollAreaContext
        if (viewport) {
            const handleScroll = () => {
                debounceScrollEnd()
                if (!removeUnlinkedScrollListenerRef.current) {
                    const listener = addUnlinkedScrollListener(
                        viewport,
                        onThumbPositionChange,
                    )
                    removeUnlinkedScrollListenerRef.current = listener
                    onThumbPositionChange()
                }
            }
            onThumbPositionChange()
            viewport.addEventListener('scroll', handleScroll)
            return () => viewport.removeEventListener('scroll', handleScroll)
        }

        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange])

    return (
        <div
            data-state={scrollbarContext.hasThumb ? 'visible' : 'hidden'}
            {...rest}
            ref={composedRef}
            style={{
                width: 'var(--scroll-thumb-width, var(--scroll-thumb-cross-size))',
                height: 'var(--scroll-thumb-height, var(--scroll-thumb-cross-size))',
                ...style,
            }}
            onPointerDownCapture={composeEventHandlers(
                props.onPointerDownCapture,
                (event) => {
                    const thumb = event.target as HTMLElement
                    const thumbRect = thumb.getBoundingClientRect()
                    const x = event.clientX - thumbRect.left
                    const y = event.clientY - thumbRect.top
                    scrollbarContext.onThumbPointerDown({ x, y })
                },
            )}
            onPointerUp={composeEventHandlers(
                props.onPointerUp,
                scrollbarContext.onThumbPointerUp,
            )}
        />
    )
}

interface ScrollThumbProps extends ThumbProps {
    forceMount?: true
}

const ScrollThumb = (props: ScrollThumbProps) => {
    const { forceMount, ...thumbProps } = props
    const scrollbarContext = useScrollbarContext()

    if (forceMount || scrollbarContext.hasThumb) {
        return <Thumb {...thumbProps} />
    }

    return null
}

export default ScrollThumb
