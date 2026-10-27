import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { TableProvider } from './context'
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import type { TableVerticalDivider } from './context'

export type TableProps = ComponentPropsWithRef<'table'> & {
    asElement?: ElementType
    bordered?: boolean
    compact?: boolean
    hoverable?: boolean
    overflow?: boolean
    overflowClass?: string
    renderOverflow?: (table: ReactNode) => ReactNode
    verticalDivider?: TableVerticalDivider
}

const defaultVerticalDivider = { head: false, body: false, footer: false }

const BorderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    return (
        <div
            className={classNames(
                'table-border border bg-card rounded-card overflow-hidden',
                tableClassNames?.border,
            )}
        >
            {children}
        </div>
    )
}

const OverflowWrapper = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    return (
        <div
            className={classNames(
                'overflow-x-auto w-full',
                tableClassNames?.overflow,
                className,
            )}
        >
            {children}
        </div>
    )
}

const Table = (props: TableProps) => {
    const {
        asElement: Component = 'table',
        bordered: borderedProp,
        children,
        className,
        compact: compactProp,
        hoverable: hoverableProp,
        overflow = true,
        overflowClass,
        renderOverflow,
        verticalDivider: _verticalDivider,
        ref,
        ...rest
    } = props

    const verticalDivider = {
        ...defaultVerticalDivider,
        ..._verticalDivider,
    }
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const tableClassNames = configClassNames?.table

    const bordered = borderedProp ?? componentDefaults?.table?.bordered ?? false
    const compact = compactProp ?? componentDefaults?.table?.compact ?? false
    const hoverable =
        hoverableProp ?? componentDefaults?.table?.hoverable ?? true

    const tableClass = classNames(
        Component === 'table'
            ? 'table-default table-auto min-w-full divide-y divide-border'
            : 'table-flex min-w-full divide-y divide-x divide-border',
        hoverable && 'table-hover',
        compact && 'table-compact',
        verticalDivider.body && 'table-vertical-divider-body',
        verticalDivider.head && 'table-vertical-divider-head',
        verticalDivider.footer && 'table-vertical-divider-foot',
        tableClassNames?.root,
        className,
    )

    const renderTable = () => {
        const table = (
            <TableProvider value={{ compact, hoverable, verticalDivider }}>
                <Component className={tableClass} {...rest} ref={ref}>
                    {children}
                </Component>
            </TableProvider>
        )

        const overflowContent = overflow
            ? renderOverflow
                ? renderOverflow(table)
                : (
                      <OverflowWrapper className={overflowClass}>
                          {table}
                      </OverflowWrapper>
                  )
            : table

        return bordered ? (
            <BorderWrapper>{overflowContent}</BorderWrapper>
        ) : (
            overflowContent
        )
    }

    return <>{renderTable()}</>
}

export default Table
