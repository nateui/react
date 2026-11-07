import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import { renderBreadcrumbIcon } from './utils'
import type { BreadcrumbPageProps } from './types'

const BreadcrumbPage = (props: BreadcrumbPageProps) => {
    const {
        children,
        className,
        current = true,
        icon,
        iconClassName,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <span
            ref={ref}
            aria-current={current ? 'page' : undefined}
            className={classNames(
                'breadcrumb-page inline-flex min-w-0 items-center gap-1 font-semibold text-foreground',
                breadcrumbClassNames?.page,
                className,
            )}
            {...rest}
        >
            {renderBreadcrumbIcon(
                icon,
                classNames(breadcrumbClassNames?.icon, iconClassName),
            )}
            <span className="truncate">{children}</span>
        </span>
    )
}

export default BreadcrumbPage
