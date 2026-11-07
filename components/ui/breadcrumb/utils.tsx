import { ChevronLeft, ChevronRight } from '../icons/index'
import classNames from '@/utils/class-names'
import type { ReactNode } from 'react'
import type { TypeAttributes } from '../config-provider/index'
import type { BreadcrumbDisplayItem, BreadcrumbItemData } from './types'

export const getDisplayItems = (
    items: BreadcrumbItemData[],
    maxItems?: number,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
): BreadcrumbDisplayItem[] => {
    const mappedItems = items.map((item, index) => ({
        type: 'item' as const,
        item,
        index,
    }))

    if (!maxItems || items.length <= maxItems || maxItems < 3) {
        return mappedItems
    }

    const visibleSlots = Math.max(1, maxItems - 1)
    let beforeCount = Math.min(Math.max(0, itemsBeforeCollapse), visibleSlots)
    let afterCount = Math.min(
        Math.max(0, itemsAfterCollapse),
        visibleSlots - beforeCount,
    )

    if (beforeCount + afterCount < visibleSlots) {
        afterCount = Math.min(
            items.length - beforeCount,
            afterCount + visibleSlots - beforeCount - afterCount,
        )
    }

    if (beforeCount + afterCount >= items.length) {
        return mappedItems
    }

    return [
        ...mappedItems.slice(0, beforeCount),
        { type: 'ellipsis' as const, key: 'breadcrumb-ellipsis' },
        ...mappedItems.slice(items.length - afterCount),
    ]
}

export const renderDefaultSeparator = (
    direction: TypeAttributes.Direction,
) => (direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />)

export const renderBreadcrumbIcon = (
    icon: ReactNode,
    className?: string,
) => {
    if (!icon) {
        return null
    }

    return (
        <span
            className={classNames(
                'breadcrumb-icon inline-flex size-4 shrink-0 items-center justify-center',
                className,
            )}
            aria-hidden="true"
        >
            {icon}
        </span>
    )
}
