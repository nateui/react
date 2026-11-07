import classNames from '@/utils/class-names'
import Header from './header'
import { useConfig } from '../../config-provider/index'
import { isMonthInRange, getMonthsNames, formatYear } from '../utils/index'
import type { ComponentProps } from 'react'

export type MonthTableProps = Omit<ComponentProps<'div'>, 'onChange'> & {
    value: { year: number; month: number }
    onChange: (value: number) => void
    locale: string
    year: number
    onYearChange: (year: number) => void
    onNextLevel?: () => void
    minDate?: Date
    maxDate?: Date
    monthLabelFormat?: string
    yearLabelFormat?: string
    preventFocus?: boolean
}

const MonthTable = (props: MonthTableProps) => {
    const {
        className,
        value,
        onChange,
        locale,
        year,
        onYearChange,
        onNextLevel,
        minDate,
        maxDate,
        preventFocus,
        monthLabelFormat = 'MMM',
        yearLabelFormat = 'YYYY',
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const calendarClassNames = configClassNames?.calendar

    const range = getMonthsNames(locale, monthLabelFormat)
    const minYear = minDate instanceof Date ? minDate.getFullYear() : undefined
    const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : undefined

    const months = range.map((month, index) => {
        const disabled = !isMonthInRange({
            date: new Date(year, index),
            minDate,
            maxDate,
        })

        const active = index === value.month && year === value.year

        return (
            <button
                key={month}
                className={classNames(
                    'month-picker-cell text-center py-2 rounded-control font-medium text-foreground',
                    active && !disabled
                        ? 'month-picker-cell-active text-primary-foreground bg-primary'
                        : 'text-foreground',
                    !active && !disabled && 'hover:bg-accent hover:text-accent-foreground',
                    disabled &&
                        'month-picker-cell-disabled opacity-30 bg-control-disabled cursor-not-allowed',
                    calendarClassNames?.monthCell,
                )}
                disabled={disabled}
                type="button"
                onClick={() => onChange(index)}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
            >
                {month}
            </button>
        )
    })

    return (
        <div
            className={classNames(
                'month-picker w-full',
                calendarClassNames?.root,
                className,
            )}
            {...rest}
        >
            <Header
                label={formatYear(year, yearLabelFormat)}
                hasNext={typeof maxYear === 'number' ? year < maxYear : true}
                hasPrevious={
                    typeof minYear === 'number' ? year > minYear : true
                }
                className={className}
                nextLabel={'Next year'}
                previousLabel={'Previous year'}
                preventFocus={preventFocus}
                onNext={() => onYearChange(year + 1)}
                onPrevious={() => onYearChange(year - 1)}
                onNextLevel={onNextLevel}
            />
            <div
                className={classNames(
                    'month-table grid grid-cols-3 gap-4',
                    calendarClassNames?.monthGrid,
                )}
            >
                {months}
            </div>
        </div>
    )
}

export default MonthTable
