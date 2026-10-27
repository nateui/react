import BreadcrumbEllipsis from './breadcrumb-ellipsis'
import BreadcrumbItem from './breadcrumb-item'
import BreadcrumbLink from './breadcrumb-link'
import BreadcrumbList from './breadcrumb-list'
import BreadcrumbPage from './breadcrumb-page'
import BreadcrumbSeparator from './breadcrumb-separator'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import { getDisplayItems } from './utils'
import type { ReactNode } from 'react'
import type { BreadcrumbProps } from './types'

const Breadcrumb = (props: BreadcrumbProps) => {
    const {
        children,
        className,
        classNames: breadcrumbClassNamesProp,
        ellipsisLabel,
        items,
        itemsAfterCollapse,
        itemsBeforeCollapse,
        maxItems,
        renderLink,
        separator,
        ref,
        ...rest
    } = props
    const {
        direction,
        classNames: configClassNames,
    } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    const renderSeparator = (
        index: number,
        isLast: boolean,
        className?: string,
    ) => {
        if (isLast) {
            return null
        }

        const separatorNode =
            typeof separator === 'function'
                ? separator({ index, isLast })
                : separator

        return (
            <BreadcrumbSeparator
                className={classNames(
                    breadcrumbClassNamesProp?.separator,
                    className,
                )}
                separator={separatorNode}
            />
        )
    }

    const renderItems = (): ReactNode => {
        if (!items) {
            return children
        }

        const displayItems = getDisplayItems(
            items,
            maxItems,
            itemsBeforeCollapse,
            itemsAfterCollapse,
        )

        return (
            <BreadcrumbList className={breadcrumbClassNamesProp?.list}>
                {displayItems.map((displayItem, displayIndex) => {
                    const isLast = displayIndex === displayItems.length - 1

                    if (displayItem.type === 'ellipsis') {
                        return (
                            <BreadcrumbItem
                                key={displayItem.key}
                                className={breadcrumbClassNamesProp?.item}
                            >
                                <BreadcrumbEllipsis
                                    className={
                                        breadcrumbClassNamesProp?.ellipsis
                                    }
                                    label={ellipsisLabel}
                                />
                                {renderSeparator(displayIndex, isLast)}
                            </BreadcrumbItem>
                        )
                    }

                    const { item, index } = displayItem
                    const current = item.current ?? index === items.length - 1
                    const shouldRenderLink =
                        item.href && !current && !item.disabled

                    return (
                        <BreadcrumbItem
                            key={item.key ?? item.href ?? index}
                            className={classNames(
                                breadcrumbClassNamesProp?.item,
                                item.className,
                            )}
                        >
                            {shouldRenderLink ? (
                                <BreadcrumbLink
                                    href={item.href as string}
                                    render={item.render ?? renderLink}
                                    target={item.target}
                                    rel={item.rel}
                                    title={item.title}
                                    icon={item.icon}
                                    iconClassName={
                                        breadcrumbClassNamesProp?.icon
                                    }
                                    className={classNames(
                                        breadcrumbClassNamesProp?.link,
                                        item.linkClassName,
                                    )}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage
                                    current={current}
                                    icon={item.icon}
                                    iconClassName={
                                        breadcrumbClassNamesProp?.icon
                                    }
                                    title={item.title}
                                    className={classNames(
                                        item.disabled &&
                                            'pointer-events-none opacity-50',
                                        breadcrumbClassNamesProp?.page,
                                        item.pageClassName,
                                    )}
                                >
                                    {item.label}
                                </BreadcrumbPage>
                            )}
                            {renderSeparator(
                                displayIndex,
                                isLast,
                                item.separatorClassName,
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        )
    }

    return (
        <nav
            ref={ref}
            aria-label="Breadcrumb"
            dir={direction}
            className={classNames(
                'breadcrumb max-w-full text-muted-foreground',
                breadcrumbClassNames?.root,
                className,
            )}
            {...rest}
        >
            {renderItems()}
        </nav>
    )
}

export default Breadcrumb
