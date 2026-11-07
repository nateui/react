import { useLayoutEffect, useRef } from 'react'
import useMergedRef from '@/hooks/use-merge-ref'
import { useScrollContext } from '../context'
import type { ScrollbarAxisProps } from '../types'
import getThumbSize from '../utils/get-thumb-size'
import isScrollingWithinScrollbarBounds from '../utils/is-scrolling-within-scrollbar-bounds'
import toInt from '../utils/to-int'
import Scrollbar from './bar'

type ScrollbarYProps = ScrollbarAxisProps & {
    ref?: React.Ref<HTMLDivElement>
    'data-state'?: string
}

function ScrollbarY({
    ref: forwardedRef,
    sizes,
    onSizesChange,
    onThumbPointerDown,
    onDragScroll,
    onWheelScroll,
    style,
    'data-state': dataState,
    ...rest
}: ScrollbarYProps) {
    const context = useScrollContext()
    const ref = useRef<HTMLDivElement>(null)
    const composeRefs = useMergedRef(
        forwardedRef ?? null,
        ref,
        context.onScrollbarYChange,
    )

    // Same fix as ScrollbarX (D8) — see its comment for why the state was
    // dropped in favour of an inline getComputedStyle read, and for why
    // this now also refuses to cache a zero measurement and re-measures on
    // the data-state transition rather than only on mount.
    const measure = () => {
        if (ref.current && context.viewport) {
            if (!ref.current.clientWidth && !ref.current.clientHeight) return
            const computedStyle = window.getComputedStyle(ref.current)
            onSizesChange({
                content: context.viewport.scrollHeight,
                viewport: context.viewport.offsetHeight,
                scrollbar: {
                    size: ref.current.clientHeight,
                    paddingStart: toInt(computedStyle.paddingTop),
                    paddingEnd: toInt(computedStyle.paddingBottom),
                },
            })
        }
    }

    // Depends on context.viewport and data-state — see ScrollbarX for why
    // an empty-deps effect would silently miss the first-frame measurement,
    // and why the hidden -> visible transition needs its own re-run.
    useLayoutEffect(() => {
        measure()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.viewport, dataState])

    return (
        <Scrollbar
            {...rest}
            data-state={dataState}
            data-orientation="vertical"
            ref={composeRefs}
            sizes={sizes}
            style={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--scroll-thumb-height' as any]: `${getThumbSize(sizes)}px`,
                ...style,
            }}
            onThumbPointerDown={(pointerPos) =>
                onThumbPointerDown(pointerPos.y)
            }
            onDragScroll={(pointerPos) => onDragScroll(pointerPos.y)}
            onWheelScroll={(event, maxScrollPos) => {
                if (context.viewport) {
                    const scrollPos = context.viewport.scrollTop + event.deltaY
                    onWheelScroll(scrollPos)
                    if (
                        isScrollingWithinScrollbarBounds(
                            scrollPos,
                            maxScrollPos,
                        )
                    ) {
                        event.preventDefault()
                    }
                }
            }}
            onResize={measure}
        />
    )
}

export default ScrollbarY
