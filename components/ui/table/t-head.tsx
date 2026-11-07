import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { TableSectionProvider } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type THeadProps = ComponentPropsWithRef<'thead'> & {
    asElement?: ElementType
}

const THead = (props: THeadProps) => {
    const {
        asElement: Component = 'thead',
        children,
        className,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    return (
        <TableSectionProvider value="head">
            <Component
                {...rest}
                ref={ref}
                className={classNames('thead', tableClassNames?.head, className)}
            >
                {children}
            </Component>
        </TableSectionProvider>
    )
}

export default THead
