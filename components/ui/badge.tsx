'use client'

import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { CSSProperties, Ref, ComponentProps } from 'react'

export type BadgePlacement =
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'

export type BadgeOverlap = 'square' | 'round' | 'circle'

export type BadgeProps = Omit<ComponentProps<'span'>, 'content'> & {
    badgeStyle?: CSSProperties
    content?: string | number
    innerClass?: string
    maxCount?: number
    overlap?: BadgeOverlap
    placement?: BadgePlacement
    ref?: Ref<HTMLSpanElement>
}

const squarePlacementClasses: Record<BadgePlacement, string> = {
    'top-start':
        'top-0 ltr:left-0 rtl:right-0 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'top-end':
        'top-0 ltr:right-0 rtl:left-0 -translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
    'bottom-start':
        'bottom-0 ltr:left-0 rtl:right-0 translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'bottom-end':
        'bottom-0 ltr:right-0 rtl:left-0 translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
}

const roundPlacementClasses: Record<BadgePlacement, string> = {
    'top-start':
        'top-[6%] ltr:left-[6%] rtl:right-[6%] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'top-end':
        'top-[6%] ltr:right-[6%] rtl:left-[6%] -translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
    'bottom-start':
        'bottom-[6%] ltr:left-[6%] rtl:right-[6%] translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'bottom-end':
        'bottom-[6%] ltr:right-[6%] rtl:left-[6%] translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
}

const circlePlacementClasses: Record<BadgePlacement, string> = {
    'top-start':
        'top-[14%] ltr:left-[14%] rtl:right-[14%] -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'top-end':
        'top-[14%] ltr:right-[14%] rtl:left-[14%] -translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
    'bottom-start':
        'bottom-[14%] ltr:left-[14%] rtl:right-[14%] translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2',
    'bottom-end':
        'bottom-[14%] ltr:right-[14%] rtl:left-[14%] translate-y-1/2 ltr:translate-x-1/2 rtl:-translate-x-1/2',
}

const placementClasses: Record<
    BadgeOverlap,
    Record<BadgePlacement, string>
> = {
    square: squarePlacementClasses,
    round: roundPlacementClasses,
    circle: circlePlacementClasses,
}

function hasPlacementUtility(className?: string) {
    return /(?:^|\s)(?:[a-z-]+:)*-?(?:inset|inset-x|inset-y|top|right|bottom|left)-/.test(
        className ?? '',
    )
}

const Badge = (props: BadgeProps) => {
    const {
        badgeStyle,
        children,
        className,
        content,
        innerClass,
        maxCount = 99,
        overlap = 'circle',
        placement = 'bottom-end',
        ref,
        ...rest
    } = props

    const dot = typeof content !== 'number' && typeof content !== 'string'
    const { classNames: configClassNames } = useConfig()
    const badgeClassNames = configClassNames?.badge
    const placementClass = placementClasses[overlap][placement]
    const hasCustomPlacement =
        badgeStyle?.inset !== undefined ||
        badgeStyle?.top !== undefined ||
        badgeStyle?.right !== undefined ||
        badgeStyle?.bottom !== undefined ||
        badgeStyle?.left !== undefined ||
        hasPlacementUtility(innerClass)

    const badgeClass = dot
        ? 'badge-dot w-2.5 h-2.5 border border-background rounded-badge text-xs font-medium bg-destructive text-destructive-foreground'
        : 'badge px-1 py-0.5 min-w-5 rounded-badge text-xs font-medium bg-destructive text-destructive-foreground flex items-center justify-center'

    const renderBadge = () => {
        if (children) {
            return (
                <span
                    ref={ref}
                    className={classNames(
                        'badge-wrapper relative inline-flex',
                        badgeClassNames?.root,
                        className,
                    )}
                    {...rest}
                >
                    <span
                        className={classNames(
                            badgeClass,
                            'badge-inner absolute z-10 transform',
                            !hasCustomPlacement && placementClass,
                            badgeClassNames?.indicator,
                            innerClass,
                        )}
                        style={badgeStyle}
                    >
                        {typeof content === 'number' && content > maxCount
                            ? `${maxCount}+`
                            : content}
                    </span>
                    {children}
                </span>
            )
        }
        return (
            <span
                ref={ref}
                className={classNames(
                    badgeClass,
                    badgeClassNames?.root,
                    badgeClassNames?.indicator,
                    innerClass,
                    className,
                )}
                style={badgeStyle}
                {...rest}
            >
                {content}
            </span>
        )
    }

    return renderBadge()
}

export default Badge

export { Badge }
