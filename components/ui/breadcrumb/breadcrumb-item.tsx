import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { BreadcrumbItemProps } from './types'

const BreadcrumbItem = (props: BreadcrumbItemProps) => {
    const { children, className, ref, ...rest } = props
    const { classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <li
            ref={ref}
            className={classNames(
                'breadcrumb-item inline-flex min-w-0 items-center',
                breadcrumbClassNames?.item,
                className,
            )}
            {...rest}
        >
            {children}
        </li>
    )
}

export default BreadcrumbItem
