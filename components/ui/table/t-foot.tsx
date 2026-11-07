import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { TableSectionProvider } from './context'
import type { ComponentPropsWithRef, ElementType } from 'react'

export type TFootProps = ComponentPropsWithRef<'tfoot'> & {
    asElement?: ElementType
}

const TFoot = (props: TFootProps) => {
    const {
        asElement: Component = 'tfoot',
        children,
        className,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    return (
        <TableSectionProvider value="foot">
            <Component
                {...rest}
                ref={ref}
                className={classNames('tfoot', tableClassNames?.foot, className)}
            >
                {children}
            </Component>
        </TableSectionProvider>
    )
}

export default TFoot
