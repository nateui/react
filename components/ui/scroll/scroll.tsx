import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import ScrollCorner from './scroll-corner'
import ScrollRoot from './scroll-root'
import Scrollbar from './scrollbar/index'
import ScrollThumb from './scroll-thumb'
import ScrollViewport from './scroll-viewport'
import useTouchPrimary from './hooks/use-touch-primary'
import type { ComponentProps, KeyboardEvent } from 'react'
import type { BaseScrollProps } from './types'

export type ScrollProps = ComponentProps<'div'> & BaseScrollProps

export type ScrollAutosizeProps = ScrollProps

const Scroll = (props: ScrollProps) => {
    const {
        className,
        contentClassName,
        type = 'hover',
        scrollHideDelay = 160,
        viewportProps,
        viewportRef = null,
        onScrollPositionChange,
        children,
        offsetScrollbars,
        scrollbars = 'both',
        onBottomReached,
        onTopReached,
        scrollbarSize = 4,
        edgeShadow = false,
        style,
        ref,
        ...rest
    } = props

    const [scrollbarHovered, setScrollbarHovered] = useState(false)
    const [verticalThumbVisible, setVerticalThumbVisible] = useState(false)
    const [horizontalThumbVisible, setHorizontalThumbVisible] = useState(false)
    const isTouchPrimary = useTouchPrimary()

    const localViewportRef = useRef<HTMLDivElement>(null)
    const combinedViewportRef = useCallback(
        (node: HTMLDivElement | null) => {
            localViewportRef.current = node
            if (typeof viewportRef === 'function') {
                viewportRef(node)
            } else if (viewportRef) {
                viewportRef.current = node
            }
        },
        [viewportRef],
    )
    const scrollbarSizeValue =
        typeof scrollbarSize === 'number'
            ? `${Math.max(scrollbarSize, 10)}px`
            : /^-?(?:\d+|\d*\.\d+)$/.test(scrollbarSize.trim())
              ? `${Math.max(Number(scrollbarSize), 10)}px`
              : `max(10px, ${scrollbarSize})`
    const { classNames: configClassNames } = useConfig()
    const scrollClassNames = configClassNames?.scroll

    useEffect(() => {
        if (!localViewportRef.current) {
            return
        }

        if (offsetScrollbars !== 'present') {
            return
        }

        const element = localViewportRef.current
        const updateThumbVisibility = () => {
            const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
                element
            setVerticalThumbVisible(scrollHeight > clientHeight)
            setHorizontalThumbVisible(scrollWidth > clientWidth)
        }

        updateThumbVisibility()

        const observer = new ResizeObserver(updateThumbVisibility)

        observer.observe(element)
        if (element.firstElementChild) {
            observer.observe(element.firstElementChild)
        }

        return () => observer.disconnect()
    }, [localViewportRef, offsetScrollbars])

    const [showBottomShadow, setShowBottomShadow] = useState(false)
    const [showTopShadow, setShowTopShadow] = useState(false)
    const [showLeftShadow, setShowLeftShadow] = useState(false)
    const [showRightShadow, setShowRightShadow] = useState(false)

    const viewportClassName = classNames(
        'scroll-viewport w-full h-full [-webkit-overflow-scrolling:touch] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
        !isTouchPrimary &&
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&:where([data-scrollbars="both"],[data-scrollbars="vertical"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="vertical"],[data-offset-scrollbars="present"]):where([data-vertical-hidden])]:pe-0 [&:where([data-scrollbars="both"],[data-scrollbars="vertical"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="vertical"],[data-offset-scrollbars="present"]):where([data-vertical-hidden])]:ps-0 [&:where([data-scrollbars="both"],[data-scrollbars="vertical"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="vertical"],[data-offset-scrollbars="present"]):not([data-vertical-hidden])]:pe-[var(--scroll-scrollbar-size)] [&:where([data-scrollbars="both"],[data-scrollbars="vertical"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="vertical"],[data-offset-scrollbars="present"]):not([data-vertical-hidden])]:ps-[unset] [&:where([data-scrollbars="both"],[data-scrollbars="horizontal"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="horizontal"],[data-offset-scrollbars="present"]):where([data-horizontal-hidden])]:pb-0 [&:where([data-scrollbars="both"],[data-scrollbars="horizontal"]):where([data-offset-scrollbars="both"],[data-offset-scrollbars="horizontal"],[data-offset-scrollbars="present"]):not([data-horizontal-hidden])]:pb-[var(--scroll-scrollbar-size)]',
        showTopShadow && 'scroll-shadow-top mask-t-from-75%',
        showBottomShadow && 'scroll-shadow-bottom mask-b-from-75%',
        showLeftShadow && 'scroll-shadow-left mask-l-from-75%',
        showRightShadow && 'scroll-shadow-right mask-r-from-75%',
        scrollClassNames?.viewport,
        viewportProps?.className,
    )

    const scrollbarClassName = classNames(
        classNames(
            'scroll-scrollbar group/scrollbar absolute z-10 flex select-none touch-none box-border bg-transparent transition-[opacity] duration-[160ms] ease-out motion-reduce:transition-none data-[initial]:transition-none data-[state=visible]:opacity-100 data-[state=idle]:opacity-100 data-[state=interacting]:opacity-100 data-[state=scrolling]:opacity-100 data-[dragging]:opacity-100 data-[hidden]:opacity-0 data-[state=hidden]:opacity-0 data-[state=hidden]:delay-[160ms] data-[state=hidden]:duration-[120ms] data-[overflow=false]:pointer-events-none data-[overflow=false]:!opacity-0 data-[orientation=vertical]:top-0 data-[orientation=vertical]:bottom-[var(--scroll-corner-height)] data-[orientation=vertical]:end-0 data-[orientation=vertical]:w-[var(--scroll-scrollbar-size)] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center data-[orientation=vertical]:pt-1 data-[orientation=vertical]:pb-1 data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:start-0 data-[orientation=horizontal]:end-[var(--scroll-corner-width)] data-[orientation=horizontal]:h-[var(--scroll-scrollbar-size)] data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:ps-1 data-[orientation=horizontal]:pe-1',
            type === 'hover' &&
                'data-[overflow=true]:group-hover/scroll-area:!opacity-100',
            'data-[overflow=true]:group-focus-within/scroll-area:!opacity-100',
        ),
        scrollClassNames?.scrollbar,
    )

    const thumbClassName = classNames(
        'thumb relative flex-none overflow-visible rounded-control [--scroll-thumb-cross-size:4px] bg-black/[0.08] dark:bg-white/[0.08] opacity-[var(--scroll-thumb-opacity)] transition-[width,height,background-color] duration-[160ms] ease-in-out motion-reduce:transition-none group-hover/scrollbar:[--scroll-thumb-cross-size:6px] group-hover/scrollbar:bg-black/[0.12] dark:group-hover/scrollbar:bg-white/[0.12] group-active/scrollbar:[--scroll-thumb-cross-size:6px] group-active/scrollbar:bg-black/[0.16] dark:group-active/scrollbar:bg-white/[0.16] group-active/scrollbar:transition-none group-data-[dragging]/scrollbar:[--scroll-thumb-cross-size:6px] group-data-[dragging]/scrollbar:bg-black/[0.16] dark:group-data-[dragging]/scrollbar:bg-white/[0.16] group-data-[dragging]/scrollbar:transition-none',
        scrollClassNames?.thumb,
    )

    const updateShadow = () => {
        if (edgeShadow) {
            const el = localViewportRef.current
            if (!el) return

            const {
                scrollTop,
                scrollHeight,
                clientHeight,
                scrollLeft,
                scrollWidth,
                clientWidth,
            } = el

            const isScrollableY = scrollHeight > clientHeight
            const isScrollableX = scrollWidth > clientWidth

            const atTop = scrollTop <= 1
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1

            const atLeft = scrollLeft <= 1
            const atRight = scrollLeft + clientWidth >= scrollWidth - 1

            setShowTopShadow(isScrollableY && !atTop)
            setShowBottomShadow(isScrollableY && !atBottom)
            setShowLeftShadow(isScrollableX && !atLeft)
            setShowRightShadow(isScrollableX && !atRight)
        }
    }

    useEffect(() => {
        const el = localViewportRef.current
        if (!el) return

        updateShadow()

        const resizeObserver = new ResizeObserver(updateShadow)
        resizeObserver.observe(el)

        return () => resizeObserver.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        viewportProps?.onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.target !== event.currentTarget) return

        const viewport = event.currentTarget
        const step = 40
        const isRtl = getComputedStyle(viewport).direction === 'rtl'
        const horizontalStep = isRtl ? -step : step
        const maxScrollLeft = Math.max(
            0,
            viewport.scrollWidth - viewport.clientWidth,
        )
        const maxScrollTop = Math.max(
            0,
            viewport.scrollHeight - viewport.clientHeight,
        )
        const canScrollHorizontally =
            (scrollbars === 'both' || scrollbars === 'horizontal') &&
            maxScrollLeft > 0
        const canScrollVertically =
            (scrollbars === 'both' || scrollbars === 'vertical') &&
            maxScrollTop > 0
        let left = 0
        let top = 0

        switch (event.key) {
            case 'ArrowDown':
                if (!canScrollVertically || viewport.scrollTop >= maxScrollTop) {
                    return
                }
                top = step
                break
            case 'ArrowUp':
                if (!canScrollVertically || viewport.scrollTop <= 0) {
                    return
                }
                top = -step
                break
            case 'ArrowRight':
                if (!canScrollHorizontally) return
                if (
                    (isRtl && viewport.scrollLeft <= -maxScrollLeft) ||
                    (!isRtl && viewport.scrollLeft >= maxScrollLeft)
                ) {
                    return
                }
                left = horizontalStep
                break
            case 'ArrowLeft':
                if (!canScrollHorizontally) return
                if (
                    (isRtl && viewport.scrollLeft >= 0) ||
                    (!isRtl && viewport.scrollLeft <= 0)
                ) {
                    return
                }
                left = -horizontalStep
                break
            case 'PageDown':
                if (!canScrollVertically || viewport.scrollTop >= maxScrollTop) {
                    return
                }
                top = Math.max(viewport.clientHeight, step)
                break
            case 'PageUp':
                if (!canScrollVertically || viewport.scrollTop <= 0) {
                    return
                }
                top = -Math.max(viewport.clientHeight, step)
                break
            default:
                return
        }

        event.preventDefault()
        viewport.scrollBy({ left, top, behavior: 'auto' })
    }

    return (
        <ScrollRoot
            type={type}
            scrollHideDelay={scrollHideDelay}
            isTouchPrimary={isTouchPrimary}
            ref={ref}
            scrollbars={scrollbars}
            className={classNames(
                'scroll-root relative overflow-hidden',
                type !== 'never' && 'group/scroll-area',
                scrollClassNames?.root,
                className,
            )}
            style={{
                ['--scroll-scrollbar-size' as string]: scrollbarSizeValue,
                ...style,
            }}
            {...rest}
        >
            <ScrollViewport
                {...viewportProps}
                contentClassName={classNames(
                    scrollClassNames?.content,
                    contentClassName,
                )}
                className={viewportClassName}
                style={viewportProps?.style}
                ref={combinedViewportRef}
                tabIndex={viewportProps?.tabIndex ?? 0}
                onKeyDown={handleViewportKeyDown}
                data-offset-scrollbars={
                    !isTouchPrimary
                        ? offsetScrollbars === true
                            ? 'both'
                            : offsetScrollbars || undefined
                        : undefined
                }
                data-scrollbars={!isTouchPrimary ? scrollbars : undefined}
                data-horizontal-hidden={
                    !isTouchPrimary &&
                    offsetScrollbars === 'present' &&
                    !horizontalThumbVisible
                        ? 'true'
                        : undefined
                }
                data-vertical-hidden={
                    !isTouchPrimary &&
                    offsetScrollbars === 'present' &&
                    !verticalThumbVisible
                        ? 'true'
                        : undefined
                }
                onScroll={(e) => {
                    viewportProps?.onScroll?.(e)
                    onScrollPositionChange?.({
                        x: e.currentTarget.scrollLeft,
                        y: e.currentTarget.scrollTop,
                    })

                    updateShadow()

                    const { scrollTop, scrollHeight, clientHeight } =
                        e.currentTarget
                    if (scrollTop - (scrollHeight - clientHeight) >= 0) {
                        onBottomReached?.()
                    }
                    if (scrollTop === 0) {
                        onTopReached?.()
                    }
                }}
            >
                {children}
            </ScrollViewport>
            {!isTouchPrimary &&
                type !== 'never' &&
                (scrollbars === 'both' || scrollbars === 'horizontal') && (
                <Scrollbar
                    className={scrollbarClassName}
                    orientation="horizontal"
                    data-state={type === 'always' ? 'visible' : undefined}
                    data-hidden={
                        offsetScrollbars === 'present' && !horizontalThumbVisible
                            ? true
                            : undefined
                    }
                    forceMount
                    onMouseEnter={() => setScrollbarHovered(true)}
                    onMouseLeave={() => setScrollbarHovered(false)}
                >
                    <ScrollThumb
                        className={thumbClassName}
                        style={{ translate: '0 -2px' }}
                    />
                </Scrollbar>
            )}

            {!isTouchPrimary &&
                type !== 'never' &&
                (scrollbars === 'both' || scrollbars === 'vertical') && (
                <Scrollbar
                    className={scrollbarClassName}
                    orientation="vertical"
                    data-state={type === 'always' ? 'visible' : undefined}
                    data-hidden={
                        offsetScrollbars === 'present' && !verticalThumbVisible
                            ? true
                            : undefined
                    }
                    forceMount
                    onMouseEnter={() => setScrollbarHovered(true)}
                    onMouseLeave={() => setScrollbarHovered(false)}
                >
                    <ScrollThumb
                        className={thumbClassName}
                        style={{ translate: '-2px 0' }}
                    />
                </Scrollbar>
            )}

            <ScrollCorner
                className={classNames(
                    'corner absolute opacity-0 transition-opacity duration-150 ease-in-out block bottom-0 end-0 data-[hovered]:opacity-100 data-[hidden]:hidden',
                    scrollClassNames?.corner,
                )}
                data-hovered={scrollbarHovered || undefined}
                data-hidden={type === 'never' || undefined}
            />
        </ScrollRoot>
    )
}

export default Scroll
