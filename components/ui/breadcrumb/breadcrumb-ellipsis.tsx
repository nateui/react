import { DotsHorizontal } from '../icons/index'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { BreadcrumbEllipsisProps } from './types'

const BreadcrumbEllipsis = (props: BreadcrumbEllipsisProps) => {
    const {
        className,
        children,
        label = 'More pages',
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <span
            ref={ref}
            className={classNames(
                'breadcrumb-ellipsis inline-flex size-6 shrink-0 items-center justify-center rounded-control-sm text-muted-foreground',
                breadcrumbClassNames?.ellipsis,
                className,
            )}
            {...rest}
        >
            {children ?? <DotsHorizontal />}
            <span className="sr-only">{label}</span>
        </span>
    )
}

export default BreadcrumbEllipsis
