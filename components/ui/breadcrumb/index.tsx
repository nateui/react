import BreadcrumbRoot from './breadcrumb'
import BreadcrumbEllipsis from './breadcrumb-ellipsis'
import BreadcrumbItem from './breadcrumb-item'
import BreadcrumbLink from './breadcrumb-link'
import BreadcrumbList from './breadcrumb-list'
import BreadcrumbPage from './breadcrumb-page'
import BreadcrumbSeparator from './breadcrumb-separator'

export type {
    BreadcrumbEllipsisProps,
    BreadcrumbItemData,
    BreadcrumbItemProps,
    BreadcrumbLinkProps,
    BreadcrumbListProps,
    BreadcrumbPageProps,
    BreadcrumbProps,
    BreadcrumbSeparatorRenderer,
    BreadcrumbSeparatorRenderProps,
    BreadcrumbSeparatorProps,
    BreadcrumbSlotClassNames,
} from './types'

type CompoundedComponent = typeof BreadcrumbRoot & {
    Root: typeof BreadcrumbRoot
    List: typeof BreadcrumbList
    Item: typeof BreadcrumbItem
    Link: typeof BreadcrumbLink
    Page: typeof BreadcrumbPage
    Separator: typeof BreadcrumbSeparator
    Ellipsis: typeof BreadcrumbEllipsis
}

const Breadcrumb = BreadcrumbRoot as CompoundedComponent

Breadcrumb.Root = BreadcrumbRoot
Breadcrumb.List = BreadcrumbList
Breadcrumb.Item = BreadcrumbItem
Breadcrumb.Link = BreadcrumbLink
Breadcrumb.Page = BreadcrumbPage
Breadcrumb.Separator = BreadcrumbSeparator
Breadcrumb.Ellipsis = BreadcrumbEllipsis

export {
    Breadcrumb,
    BreadcrumbRoot,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
}

export default Breadcrumb
