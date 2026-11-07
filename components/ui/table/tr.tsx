import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useTable, useTableSection } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type TrProps = ComponentPropsWithRef<'tr'> & {
    asElement?: ElementType
}

const Tr = (props: TrProps) => {
    const { asElement: Component = 'tr', children, className, ref, ...rest } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table
    const { hoverable, verticalDivider } = useTable()
    const section = useTableSection()
    const hasVerticalDivider =
        (section === 'head' && verticalDivider.head) ||
        (section === 'body' && verticalDivider.body) ||
        (section === 'foot' && verticalDivider.footer)

    return (
        <Component
            ref={ref}
            {...rest}
            className={classNames(
                'tr',
                section === 'body' && hoverable && 'hover:bg-accent',
                hasVerticalDivider && 'divide-x divide-border',
                tableClassNames?.row,
                className,
            )}
        >
            {children}
        </Component>
    )
}

export default Tr
