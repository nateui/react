import { createContext, useContext } from 'react'

export type TableSection = 'head' | 'body' | 'foot'

export type TableVerticalDivider = {
    head?: boolean
    body?: boolean
    footer?: boolean
}

type TableContextValue = {
    compact: boolean
    hoverable: boolean
    verticalDivider: TableVerticalDivider
}

const TableContext = createContext<TableContextValue>({
    compact: false,
    hoverable: false,
    verticalDivider: {},
})

const TableSectionContext = createContext<TableSection | undefined>(undefined)

export const TableProvider = TableContext.Provider

export const TableSectionProvider = TableSectionContext.Provider

export function useTable() {
    return useContext(TableContext)
}

export function useTableSection() {
    return useContext(TableSectionContext)
}
