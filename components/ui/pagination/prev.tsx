import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { ChevronLeft } from '../icons/index'
import type { MouseEvent, ComponentProps } from 'react'

export type PrevProps = ComponentProps<'span'> & {
    currentPage: number
    pagerClass: {
        default: string
        inactive: string
        active: string
        disabled: string
    }
    onPrev: (e: MouseEvent<HTMLSpanElement>) => void
}

const Prev = (props: PrevProps) => {
    const { currentPage, pagerClass, onPrev } = props
    const { classNames: configClassNames } = useConfig()
    const paginationClassNames = configClassNames?.pagination

    const disabled = currentPage <= 1

    const onPrevClick = (e: MouseEvent<HTMLSpanElement>) => {
        if (disabled) {
            return
        }
        onPrev(e)
    }

    const pagerPrevClass = classNames(
        pagerClass.default,
        'pagination-pager-prev ml-0.5 rtl:rotate-180',
        disabled ? pagerClass.disabled : pagerClass.inactive,
        paginationClassNames?.previousTrigger,
    )

    return (
        <span
            className={pagerPrevClass}
            data-disabled={disabled ? '' : undefined}
            role="presentation"
            onClick={onPrevClick}
        >
            <ChevronLeft />
        </span>
    )
}

export default Prev
