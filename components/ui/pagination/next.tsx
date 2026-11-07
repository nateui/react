import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { ChevronRight } from '../icons/index'
import type { MouseEvent, ComponentProps } from 'react'

export type NextProps = ComponentProps<'span'> & {
    currentPage: number
    pageCount: number
    pagerClass: {
        default: string
        inactive: string
        active: string
        disabled: string
    }
    onNext: (e: MouseEvent<HTMLSpanElement>) => void
}

const Next = (props: NextProps) => {
    const { currentPage, pageCount, pagerClass, onNext } = props
    const { classNames: configClassNames } = useConfig()
    const paginationClassNames = configClassNames?.pagination

    const disabled = currentPage === pageCount || pageCount === 0

    const onNextClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        if (disabled) {
            return
        }
        onNext(e)
    }

    const pagerNextClass = classNames(
        pagerClass.default,
        'pagination-pager-next mr-0.5 rtl:rotate-180',
        disabled ? pagerClass.disabled : pagerClass.inactive,
        paginationClassNames?.nextTrigger,
    )

    return (
        <span
            className={pagerNextClass}
            data-disabled={disabled ? '' : undefined}
            role="presentation"
            onClick={onNextClick}
        >
            <ChevronRight />
        </span>
    )
}

export default Next
