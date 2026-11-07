import classNames from '@/utils/class-names'
import { useScrollContext } from './context'
import { useCallback } from 'react'
import type { ComponentProps, Ref } from 'react'
export type ScrollViewportProps = ComponentProps<'div'> & {
    ref?: Ref<HTMLDivElement>
    contentClassName?: string
}

const ScrollViewport = ({
    children,
    style,
    ref = null,
    contentClassName,
    ...rest
}: ScrollViewportProps) => {
    const context = useScrollContext()
    const canScrollHorizontally =
        context.scrollbars === 'both' || context.scrollbars === 'horizontal'
    const canScrollVertically =
        context.scrollbars === 'both' || context.scrollbars === 'vertical'
    const desktopScrollbarsEnabled = {
        horizontal:
            context.scrollbarXEnabled ||
            (context.type === 'never' && canScrollHorizontally),
        vertical:
            context.scrollbarYEnabled ||
            (context.type === 'never' && canScrollVertically),
    }
    const overflowX = context.isTouchPrimary
        ? canScrollHorizontally
            ? 'auto'
            : 'hidden'
        : desktopScrollbarsEnabled.horizontal
          ? 'scroll'
          : 'hidden'
    const overflowY = context.isTouchPrimary
        ? canScrollVertically
            ? 'auto'
            : 'hidden'
        : desktopScrollbarsEnabled.vertical
          ? 'scroll'
          : 'hidden'
    const rootRef = useCallback(
        (node: HTMLDivElement | null) => {
            context.onViewportChange(node)
            if (typeof ref === 'function') {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        },
        [ref, context.onViewportChange],
    )

    return (
        <div
            {...rest}
            ref={rootRef}
            style={{
                ...style,
                overflowX,
                overflowY,
            }}
        >
            <div
                className={classNames(
                    'scroll-viewport-content table min-w-full',
                    contentClassName,
                )}
                ref={context.onContentChange}
            >
                {children}
            </div>
        </div>
    )
}

export default ScrollViewport
