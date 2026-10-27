import { useCallback, useEffect, useRef, useState } from 'react'
import { useTabs } from './context'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import type {
    ComponentPropsWithRef,
    KeyboardEvent,
} from 'react'

export type TabListProps = ComponentPropsWithRef<'div'> & {
    indicatorClass?: string
}

const TabList = (props: TabListProps) => {
    const {
        className,
        children,
        ref = null,
        indicatorClass,
        onKeyDown,
        ...rest
    } = props
    const {
        onValueChange,
        orientation = 'horizontal',
        value,
        variant,
    } = useTabs()
    const { classNames: configClassNames, direction } = useConfig()
    const tabsClassNames = configClassNames?.tabs
    const tabListRef = useRef<HTMLDivElement | null>(null)
    const indicattorTransition = useRef<string | undefined>(undefined)
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

    useEffect(() => {
        if (value !== undefined || !tabListRef.current) return
        const firstTab = tabListRef.current.querySelector<HTMLButtonElement>(
            'button[role="tab"]:not([disabled])',
        )
        if (firstTab?.dataset.value !== undefined) {
            onValueChange?.(firstTab.dataset.value)
        }
    }, [onValueChange, value])

    useEffect(() => {
        if (tabListRef.current) {
            const activeTab = tabListRef.current.querySelector<HTMLElement>(
                '[role="tab"][aria-selected="true"]',
            )
            if (activeTab) {
                const { offsetLeft, offsetWidth } = activeTab
                const activeTabOffsetParent =
                    activeTab.offsetParent as HTMLElement | null
                const offsetParentWidth = activeTabOffsetParent?.offsetWidth || 0
                const left =
                    direction === 'rtl'
                        ? (offsetParentWidth - (offsetLeft + offsetWidth)) * -1
                        : offsetLeft

                setIndicatorStyle({ left, width: offsetWidth })
                if (!indicattorTransition.current) {
                    indicattorTransition.current = 'tab-indicator-transition'
                }
            } else {
                setIndicatorStyle({ left: 0, width: 0 })
            }
        }
    }, [value, direction])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event)
            if (event.defaultPrevented || !tabListRef.current) return

            const tabs = Array.from(
                tabListRef.current.querySelectorAll<HTMLButtonElement>(
                    'button[role="tab"]:not([disabled])',
                ),
            )
            if (tabs.length === 0) return

            const currentIndex = Math.max(
                0,
                tabs.indexOf(document.activeElement as HTMLButtonElement),
            )
            let nextIndex: number | undefined
            const isHorizontal = orientation === 'horizontal'
            const isPrevious = isHorizontal
                ? direction === 'rtl'
                    ? event.key === 'ArrowRight'
                    : event.key === 'ArrowLeft'
                : event.key === 'ArrowUp'
            const isNext = isHorizontal
                ? direction === 'rtl'
                    ? event.key === 'ArrowLeft'
                    : event.key === 'ArrowRight'
                : event.key === 'ArrowDown'

            if (isPrevious) {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
            } else if (isNext) {
                nextIndex = (currentIndex + 1) % tabs.length
            } else if (event.key === 'Home') {
                nextIndex = 0
            } else if (event.key === 'End') {
                nextIndex = tabs.length - 1
            }

            if (nextIndex === undefined) return
            event.preventDefault()
            const nextTab = tabs[nextIndex]
            nextTab.focus()
        },
        [direction, onKeyDown, orientation],
    )

    const tabListClass = classNames(
        'tab-list group/tab-list relative flex items-center overflow-x-auto overflow-y-hidden',
        `tab-list-${variant}`,
        variant === 'underline' && 'tab-list-underline border-b',
        tabsClassNames?.list,
        className,
    )

    return (
        <div
            {...rest}
            ref={useMergedRef(ref, tabListRef)}
            role="tablist"
            aria-orientation={orientation}
            className={tabListClass}
            data-variant={variant}
            data-orientation={orientation}
            onKeyDown={handleKeyDown}
        >
            {children}
            <div
                aria-hidden="true"
                className={classNames(
                    'tab-indicator absolute bottom-0 ltr:left-0 rtl:right-0 bg-primary',
                    variant,
                    variant === 'underline' && 'h-0.5',
                    variant === 'pill' && 'h-full rounded-control',
                    indicattorTransition.current &&
                        'tab-indicator-transition transition duration-200 ease-in-out',
                    tabsClassNames?.indicator,
                    indicatorClass,
                )}
                data-variant={variant}
                style={{
                    transform: `translateX(${indicatorStyle.left}px)`,
                    width: `${indicatorStyle.width}px`,
                }}
            />
        </div>
    )
}

export default TabList
