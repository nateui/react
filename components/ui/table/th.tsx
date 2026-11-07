import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useTable } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type ThProps = ComponentPropsWithRef<'th'> & {
    asElement?: ElementType
}

const Th = (props: ThProps) => {
    const { asElement: Component = 'th', children, className, ref, ...rest } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table
    const { compact } = useTable()

    return (
        <Component
            {...rest}
            ref={ref}
            className={classNames(
                'th wrap-break-word px-6 py-3 text-left rtl:text-right text-xs font-medium uppercase tracking-wider text-muted-foreground',
                compact && 'px-2 py-2',
                tableClassNames?.headerCell,
                className,
            )}
        >
            {children}
        </Component>
    )
}

export default Th
