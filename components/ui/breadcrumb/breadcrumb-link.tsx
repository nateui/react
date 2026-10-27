import BaseLink from '../link'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import { renderBreadcrumbIcon } from './utils'
import type { BreadcrumbLinkProps } from './types'

const BreadcrumbLink = (props: BreadcrumbLinkProps) => {
    const {
        children,
        className,
        icon,
        iconClassName,
        render,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <BaseLink
            ref={ref}
            render={render}
            className={classNames(
                'breadcrumb-link inline-flex min-w-0 items-center gap-1 rounded-control-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                breadcrumbClassNames?.link,
                className,
            )}
            {...rest}
        >
            {renderBreadcrumbIcon(
                icon,
                classNames(breadcrumbClassNames?.icon, iconClassName),
            )}
            <span className="truncate">{children}</span>
        </BaseLink>
    )
}

export default BreadcrumbLink
