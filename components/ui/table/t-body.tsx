import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { TableSectionProvider } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type TBodyProps = ComponentPropsWithRef<'tbody'> & {
    asElement?: ElementType
}

const TBody = (props: TBodyProps) => {
    const {
        asElement: Component = 'tbody',
        children,
        className,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    return (
        <TableSectionProvider value="body">
            <Component
                {...rest}
                ref={ref}
                className={classNames(
                    'tbody divide-y divide-border',
                    tableClassNames?.body,
                    className,
                )}
            >
                {children}
            </Component>
        </TableSectionProvider>
    )
}

export default TBody
