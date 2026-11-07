import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { BreadcrumbListProps } from './types'

const BreadcrumbList = (props: BreadcrumbListProps) => {
    const { children, className, ref, ...rest } = props
    const { classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <ol
            ref={ref}
            className={classNames(
                'breadcrumb-list flex flex-wrap items-center gap-y-1',
                breadcrumbClassNames?.list,
                className,
            )}
            {...rest}
        >
            {children}
        </ol>
    )
}

export default BreadcrumbList
