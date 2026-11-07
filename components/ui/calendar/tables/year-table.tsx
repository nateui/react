import { useState } from 'react'
import classNames from '@/utils/class-names'
import Header from './header'
import { useConfig } from '../../config-provider/index'
import { getDecadeRange, formatYear } from '../utils/index'
import type { ComponentProps } from 'react'

export type YearTableProps = Omit<ComponentProps<'div'>, 'onChange'> & {
    value: number
    onChange: (value: number) => void
    minYear?: number
    maxYear?: number
    yearLabelFormat?: string
    preventFocus?: boolean
}

const YearTable = (props: YearTableProps) => {
    const {
        className,
        value,
        onChange,
        minYear,
        maxYear,
        preventFocus,
        yearLabelFormat = 'YYYY',
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const calendarClassNames = configClassNames?.calendar

    const [decade, setDecade] = useState(value)
    const range = getDecadeRange(decade)

    const years = range.map((year) => {
        const disabled =
            year < (minYear as number) || year > (maxYear as number)

        const active = year === value

        return (
            <button
                key={year}
                disabled={disabled}
                className={classNames(
                    'year-picker-cell text-center py-2 rounded-control font-medium text-foreground',
                    active && !disabled
                        ? 'year-picker-cell-active text-primary-foreground bg-primary'
                        : 'text-foreground',
                    !active && !disabled && 'hover:bg-accent hover:text-accent-foreground',
                    disabled &&
                        'year-picker-cell-disabled opacity-30 bg-control-disabled cursor-not-allowed',
                    calendarClassNames?.yearCell,
                )}
                type="button"
                onClick={() => onChange(year)}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
            >
                {formatYear(year, yearLabelFormat)}
            </button>
        )
    })

    return (
        <div
            className={classNames(
                'year-picker w-full',
                calendarClassNames?.root,
                className,
            )}
            {...rest}
        >
            <Header
                nextLevelDisabled
                label={`${formatYear(range[0], yearLabelFormat)} - ${formatYear(
                    range[range.length - 1],
                    yearLabelFormat,
                )}`}
                hasPrevious={
                    typeof minYear === 'number' ? minYear < range[0] : true
                }
                hasNext={
                    typeof maxYear === 'number'
                        ? maxYear > range[range.length - 1]
                        : true
                }
                nextLabel={'Next decade'}
                previousLabel={'Previous decade'}
                preventFocus={preventFocus}
                onNext={() => setDecade((current) => current + 10)}
                onPrevious={() => setDecade((current) => current - 10)}
            />
            <div
                className={classNames(
                    'year-table grid grid-cols-3 gap-4',
                    calendarClassNames?.yearGrid,
                )}
            >
                {years}
            </div>
        </div>
    )
}

export default YearTable
