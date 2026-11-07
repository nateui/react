import { useState, useEffect, useMemo } from 'react'
import Pager from './pagers'
import Prev from './prev'
import Next from './next'
import Total from './total'
import useControllableState from '@/hooks/use-controllable-state'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ComponentProps } from 'react'

export type PaginationProps = Omit<ComponentProps<'div'>, 'onChange'> & {
    currentPage?: number
    displayTotal?: boolean
    onChange?: (pageNumber: number) => void
    pageSize?: number
    total?: number
}

const defaultTotal = 5

const Pagination = (props: PaginationProps) => {
    const {
        className,
        currentPage = 1,
        displayTotal = false,
        onChange,
        pageSize = 1,
        total = 5,
    } = props
    const { classNames: configClassNames } = useConfig()
    const paginationClassNames = configClassNames?.pagination

    const [paginationTotal] = useControllableState({
        prop: total,
        defaultProp: defaultTotal,
        onChange,
    })

    const [internalPageSize, setInternalPageSize] = useState(pageSize)

    const getInternalPageCount = useMemo(() => {
        if (typeof paginationTotal === 'number') {
            return Math.ceil(paginationTotal / internalPageSize)
        }
        return null
    }, [paginationTotal, internalPageSize])

    const getValidCurrentPage = (count: number | string) => {
        const value = parseInt(count as string, 10)
        const internalPageCount = getInternalPageCount
        let resetValue
        if (!internalPageCount) {
            if (isNaN(value) || value < 1) {
                resetValue = 1
            }
        } else {
            if (value < 1) {
                resetValue = 1
            }
            if (value > internalPageCount) {
                resetValue = internalPageCount
            }
        }

        if ((resetValue === undefined && isNaN(value)) || resetValue === 0) {
            resetValue = 1
        }

        return resetValue === undefined ? value : resetValue
    }

    const [internalCurrentPage, setInternalCurrentPage] = useState(
        currentPage ? getValidCurrentPage(currentPage) : 1,
    )

    useEffect(() => {
        if (pageSize !== internalPageSize) {
            setInternalPageSize(pageSize)
        }

        if (currentPage !== internalCurrentPage) {
            setInternalCurrentPage(currentPage)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage])

    const onPaginationChange = (val: number) => {
        setInternalCurrentPage(getValidCurrentPage(val))
        onChange?.(getValidCurrentPage(val))
    }

    const onPrev = () => {
        const newPage = internalCurrentPage - 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }

    const onNext = () => {
        const newPage = internalCurrentPage + 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }

    const pagerClass = {
        default:
            'pagination-pager cursor-pointer relative mx-0.5 rounded-control inline-flex items-center h-8 w-8 justify-center text-sm font-medium select-none border border-transparent',
        inactive:
            'pagination-pager-inactive text-muted-foreground hover:bg-muted hover:text-muted-foreground',
        active: `pagination-pager-active text-foreground bg-muted`,
        disabled:
            'pagination-pager-disabled cursor-not-allowed text-control-disabled-foreground',
    }

    const paginationClass = classNames(
        'pagination relative z-0 inline-flex items-center rounded-control',
        paginationClassNames?.root,
        className,
    )

    return (
        <div className={paginationClass}>
            {displayTotal && <Total total={total} />}
            <Prev
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onPrev={onPrev}
            />
            <Pager
                pageCount={getInternalPageCount as number}
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onChange={onPaginationChange}
            />
            <Next
                currentPage={internalCurrentPage}
                pageCount={getInternalPageCount as number}
                pagerClass={pagerClass}
                onNext={onNext}
            />
        </div>
    )
}

Pagination.displayName = 'Pagination'

export default Pagination
