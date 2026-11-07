import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import { renderDefaultSeparator } from './utils'
import type { BreadcrumbSeparatorProps } from './types'

const BreadcrumbSeparator = (props: BreadcrumbSeparatorProps) => {
    const { className, children, ref, separator, ...rest } = props
    const { direction, classNames: configClassNames } = useConfig()
    const breadcrumbClassNames = configClassNames?.breadcrumb

    return (
        <span
            ref={ref}
            aria-hidden="true"
            role="presentation"
            className={classNames(
                'breadcrumb-separator mx-1.5 inline-flex shrink-0 items-center text-muted-foreground/50',
                breadcrumbClassNames?.separator,
                className,
            )}
            {...rest}
        >
            {children ?? separator ?? renderDefaultSeparator(direction)}
        </span>
    )
}

export default BreadcrumbSeparator
