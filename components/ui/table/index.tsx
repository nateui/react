import _Table from './table'
import THead from './t-head'
import TBody from './t-body'
import TFoot from './t-foot'
import Tr from './tr'
import Th from './th'
import Td from './td'
import Sorter from './sorter'

import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import type { TableProps } from './table'

export type { TableProps } from './table'
export type { THeadProps } from './t-head'
export type { TBodyProps } from './t-body'
export type { TFootProps } from './t-foot'
export type { TrProps } from './tr'
export type { ThProps } from './th'
export type { TdProps } from './td'
export type { SorterProps } from './sorter'

type CompoundedComponent = ForwardRefExoticComponent<
    TableProps & RefAttributes<HTMLElement>
> & {
    THead: typeof THead
    TBody: typeof TBody
    TFoot: typeof TFoot
    Th: typeof Th
    Tr: typeof Tr
    Td: typeof Td
    Sorter: typeof Sorter
}

const Table = _Table as CompoundedComponent

Table.THead = THead
Table.TBody = TBody
Table.TFoot = TFoot
Table.Th = Th
Table.Tr = Tr
Table.Td = Td
Table.Sorter = Sorter

export { Table }

export default Table
