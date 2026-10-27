import type {
    ComponentPropsWithRef,
    Key,
    MouseEventHandler,
    ReactNode,
} from 'react'
import type { LinkRenderer } from '../link'

export type BreadcrumbSlotClassNames = {
    list?: string
    item?: string
    link?: string
    page?: string
    separator?: string
    ellipsis?: string
    icon?: string
}

export type BreadcrumbSeparatorRenderProps = {
    index: number
    isLast: boolean
}

export type BreadcrumbSeparatorRenderer = (
    props: BreadcrumbSeparatorRenderProps,
) => ReactNode

export type BreadcrumbItemData = {
    key?: Key
    label: ReactNode
    href?: string
    icon?: ReactNode
    disabled?: boolean
    current?: boolean
    render?: LinkRenderer
    target?: ComponentPropsWithRef<'a'>['target']
    rel?: string
    title?: string
    className?: string
    linkClassName?: string
    pageClassName?: string
    separatorClassName?: string
    onClick?: MouseEventHandler<HTMLAnchorElement>
}

export type BreadcrumbProps = ComponentPropsWithRef<'nav'> & {
    items?: BreadcrumbItemData[]
    separator?: ReactNode | BreadcrumbSeparatorRenderer
    maxItems?: number
    itemsBeforeCollapse?: number
    itemsAfterCollapse?: number
    renderLink?: LinkRenderer
    classNames?: BreadcrumbSlotClassNames
    ellipsisLabel?: string
}

export type BreadcrumbListProps = ComponentPropsWithRef<'ol'>

export type BreadcrumbItemProps = ComponentPropsWithRef<'li'>

export type BreadcrumbLinkProps = Omit<ComponentPropsWithRef<'a'>, 'href'> & {
    href: string
    render?: LinkRenderer
    icon?: ReactNode
    iconClassName?: string
}

export type BreadcrumbPageProps = ComponentPropsWithRef<'span'> & {
    icon?: ReactNode
    iconClassName?: string
    current?: boolean
}

export type BreadcrumbSeparatorProps = ComponentPropsWithRef<'span'> & {
    separator?: ReactNode
}

export type BreadcrumbEllipsisProps = ComponentPropsWithRef<'span'> & {
    label?: string
}

export type BreadcrumbDisplayItem =
    | {
          type: 'item'
          item: BreadcrumbItemData
          index: number
      }
    | {
          type: 'ellipsis'
          key: string
      }
