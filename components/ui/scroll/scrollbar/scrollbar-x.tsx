import { useLayoutEffect, useRef } from 'react'
import useMergedRef from '@/hooks/use-merge-ref'
import { useScrollContext } from '../context'
import type { ScrollbarAxisProps } from '../types'
import getThumbSize from '../utils/get-thumb-size'
import isScrollingWithinScrollbarBounds from '../utils/is-scrolling-within-scrollbar-bounds'
import toInt from '../utils/to-int'
import Scrollbar from './bar'

type ScrollbarXProps = ScrollbarAxisProps & {
    ref?: React.Ref<HTMLDivElement>
    'data-state'?: string
}

function ScrollbarX({
    ref: forwardedRef,
    sizes,
    onSizesChange,
    onThumbPointerDown,
    onDragScroll,
    onWheelScroll,
    style,
    'data-state': dataState,
    ...rest
}: ScrollbarXProps) {
    const ctx = useScrollContext()
    const ref = useRef<HTMLDivElement>(null)
    const composeRefs = useMergedRef(
        forwardedRef ?? null,
        ref,
        ctx.onScrollbarXChange,
    )

    // Read getComputedStyle inline instead of holding it in state — the
    // state version made the first onResize (fired before the old
    // post-paint effect ever ran) a silent no-op, so the thumb rendered at
    // getThumbSize's 18px floor with zero sizes until the debounced resize
    // observer eventually caught up. Shared by onResize and the mount
    // measurement below so there's one implementation, not two.
    //
    // Refuses to cache a zero measurement: a zero-sized rail is not a useful
    // thumb measurement, and caching it would floor the thumb width at 18px
    // until the next resize-observer tick.
    const measure = () => {
        if (ref.current && ctx.viewport) {
            if (!ref.current.clientWidth && !ref.current.clientHeight) return
            const computedStyle = getComputedStyle(ref.current)
            onSizesChange({
                content: ctx.viewport.scrollWidth,
                viewport: ctx.viewport.offsetWidth,
                scrollbar: {
                    size: ref.current.clientWidth,
                    paddingStart: toInt(computedStyle.paddingInlineStart),
                    paddingEnd: toInt(computedStyle.paddingInlineEnd),
                },
            })
        }
    }

    // Synchronous, before paint — bypasses Bar.tsx's 10ms debounce so the
    // first frame already has real sizes instead of the floor. Depends on
    // ctx.viewport (ScrollRoot's viewport state is still null on this
    // component's own mount commit — the ref callback that sets it fires a
    // separate render, so an empty-deps effect would silently no-op on the
    // one run it gets) AND on `data-state`, so a hidden -> visible transition
    // measures synchronously before paint rather than waiting on the resize
    // observer's post-paint + 10ms-debounce path.
    useLayoutEffect(() => {
        measure()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.viewport, dataState])

    return (
        <Scrollbar
            data-orientation="horizontal"
            data-state={dataState}
            {...rest}
            ref={composeRefs}
            sizes={sizes}
            style={{
                ...style,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--scroll-thumb-width' as any]: `${getThumbSize(sizes)}px`,
            }}
            onThumbPointerDown={(pointerPos) =>
                onThumbPointerDown(pointerPos.x)
            }
            onDragScroll={(pointerPos) => onDragScroll(pointerPos.x)}
            onWheelScroll={(event, maxScrollPos) => {
                if (ctx.viewport) {
                    const scrollPos = ctx.viewport.scrollLeft + event.deltaX
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

export default ScrollbarX
