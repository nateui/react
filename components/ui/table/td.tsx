import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useTable, useTableSection } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type TdProps = ComponentPropsWithRef<'td'> & {
    asElement?: ElementType
}

const Td = (props: TdProps) => {
    const { asElement: Component = 'td', children, className, ref, ...rest } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table
    const { compact } = useTable()
    const section = useTableSection()
    const cellClass =
        section === 'foot'
            ? 'px-6 py-3 border-t'
            : compact
              ? 'px-2 py-2'
              : 'px-6 py-4'

    return (
        <Component
            ref={ref}
            {...rest}
            className={classNames(
                'td wrap-break-word',
                cellClass,
                tableClassNames?.cell,
                className,
            )}
        >
            {children}
        </Component>
    )
}

export default Td
