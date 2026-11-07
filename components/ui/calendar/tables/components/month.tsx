import { useMemo } from 'react'
import classNames from '@/utils/class-names'
import dayjs from 'dayjs'
import Day from './day'
import getDayProps from './props/get-day-props'
import { isSameDate, getWeekdaysNames, getMonthDays } from '../../utils/index'
import { useConfig } from '../../../config-provider/index'
import type { FirstDayOfWeek } from '../../types'
import type { Modifiers, DayKeydownPayload } from './types'
import type { GetDayPropsReturn } from './props/get-day-props'
import type {
    ComponentProps,
    KeyboardEvent,
    ReactNode,
    MouseEvent,
    CSSProperties,
    Ref,
} from 'react'

export interface MonthBaseProps {
    month?: Date
    value?: Date | Date[]
    dayClassName?: (date: Date, modifiers: Modifiers) => string
    dayStyle?: (date: Date, modifiers: Modifiers) => CSSProperties
    disableDate?: (date: Date) => boolean
    disableOutOfMonth?: boolean
    minDate?: Date
    maxDate?: Date
    hideWeekdays?: boolean
    fullWidth?: boolean
    cellHeight?: number
    preventFocus?: boolean
    focusable?: boolean
    firstDayOfWeek?: FirstDayOfWeek
    hideOutOfMonthDates?: boolean
    weekendDays?: [number, number]
    isDateInRange?:
        | (() => boolean)
        | ((date: Date, props: GetDayPropsReturn) => boolean)
    isDateFirstInRange?:
        | (() => boolean)
        | ((date: Date, props: GetDayPropsReturn) => boolean)
    isDateLastInRange?:
        | (() => boolean)
        | ((date: Date, props: GetDayPropsReturn) => boolean)
}

export type MonthProps = Omit<ComponentProps<'table'>, 'onChange'> & MonthBaseProps & {
    onChange?: (value: Date) => void
    locale?: string
    onDayMouseEnter?: (date: Date, event: MouseEvent<HTMLButtonElement>) => void
    range?: [Date, Date]
    onDayKeyDown?: (
        payload: DayKeydownPayload,
        event: KeyboardEvent<HTMLButtonElement>,
    ) => void
    daysRefs: HTMLButtonElement[][]
    ref?: Ref<HTMLTableElement>
    renderDay?: (date: Date) => ReactNode
    weekdayLabelFormat?: string
}

const noop = () => false

const Month = (props: MonthProps) => {
    const {
        className,
        month,
        value,
        onChange,
        disableOutOfMonth = false,
        locale,
        dayClassName,
        dayStyle,
        minDate,
        maxDate,
        disableDate,
        onDayMouseEnter,
        range,
        hideWeekdays = false,
        fullWidth = false,
        cellHeight = 36,
        preventFocus = false,
        focusable = true,
        firstDayOfWeek = 'monday',
        onDayKeyDown,
        daysRefs,
        hideOutOfMonthDates = false,
        isDateInRange = noop,
        isDateFirstInRange = noop,
        isDateLastInRange = noop,
        ref,
        renderDay,
        weekdayLabelFormat,
        weekendDays = [0, 6],
        ...rest
    } = props

    const { classNames: configClassNames, locale: themeLocale } = useConfig()
    const calendarClassNames = configClassNames?.calendar

    const finalLocale = locale || themeLocale
    const days = getMonthDays(month as Date, firstDayOfWeek)

    const weekdays = getWeekdaysNames(
        finalLocale,
        firstDayOfWeek,
        weekdayLabelFormat,
    ).map((weekday) => (
        <th
            key={weekday}
            className={classNames('week-day-cell h-7', calendarClassNames?.weekday)}
        >
            <span className="week-day-cell-content text-xs">{weekday}</span>
        </th>
    ))

    const hasValue = Array.isArray(value)
        ? value.every((item) => item instanceof Date)
        : value instanceof Date

    const hasValueInMonthRange =
        value instanceof Date &&
        dayjs(value).isAfter(dayjs(month).startOf('month')) &&
        dayjs(value).isBefore(dayjs(month).endOf('month'))

    const getDayPropsParams = {
        month: month as Date,
        hasValue,
        minDate: minDate as Date,
        maxDate: maxDate as Date,
        value: value as Date,
        disableDate: disableDate as (date: Date) => boolean,
        disableOutOfMonth: disableOutOfMonth as boolean,
        range: range as [Date, Date],
        weekendDays,
    }

    const firstIncludedDay = useMemo(
        () =>
            days
                .flatMap((_) => _)
                .find((date) => {
                    const dayProps = getDayProps({
                        ...getDayPropsParams,
                        ...{ date },
                    })

                    return !dayProps.disabled && !dayProps.outOfMonth
                }) || dayjs(month).startOf('month').toDate(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const rows = days.map((row, rowIndex) => {
        const cells = row.map((date, cellIndex) => {
            const dayProps = getDayProps({ ...getDayPropsParams, ...{ date } })

            const onKeyDownPayload = { rowIndex, cellIndex, date }

            return (
                <td
                    key={cellIndex}
                    className={classNames(
                        'date-picker-cell text-center p-0',
                        calendarClassNames?.cell,
                    )}
                    style={{ height: cellHeight }}
                >
                    <Day
                        ref={(button) => {
                            if (daysRefs) {
                                if (!Array.isArray(daysRefs[rowIndex])) {
                                    daysRefs[rowIndex] = []
                                }

                                daysRefs[rowIndex][cellIndex] =
                                    button as HTMLButtonElement
                            }
                        }}
                        outOfMonth={dayProps.outOfMonth}
                        weekend={dayProps.weekend}
                        inRange={
                            dayProps.inRange || isDateInRange(date, dayProps)
                        }
                        firstInRange={
                            dayProps.firstInRange ||
                            isDateFirstInRange(date, dayProps)
                        }
                        lastInRange={
                            dayProps.lastInRange ||
                            isDateLastInRange(date, dayProps)
                        }
                        firstInMonth={isSameDate(date, firstIncludedDay)}
                        selected={dayProps.selected || dayProps.selectedInRange}
                        hasValue={hasValueInMonthRange}
                        className={
                            typeof dayClassName === 'function'
                                ? dayClassName(date, dayProps)
                                : ''
                        }
                        style={
                            typeof dayStyle === 'function'
                                ? dayStyle(date, dayProps)
                                : {}
                        }
                        disabled={dayProps.disabled}
                        fullWidth={fullWidth}
                        focusable={focusable}
                        hideOutOfMonthDates={hideOutOfMonthDates}
                        renderDay={renderDay}
                        isToday={isSameDate(date, new Date())}
                        value={date}
                        onClick={() =>
                            typeof onChange === 'function' && onChange(date)
                        }
                        onMouseDown={(event) =>
                            preventFocus && event.preventDefault()
                        }
                        onKeyDown={(event) =>
                            typeof onDayKeyDown === 'function' &&
                            onDayKeyDown(onKeyDownPayload, event)
                        }
                        onMouseEnter={
                            typeof onDayMouseEnter === 'function'
                                ? onDayMouseEnter
                                : noop
                        }
                    />
                </td>
            )
        })

        return (
            <tr
                key={rowIndex}
                className={classNames(
                    'date-picker-week-cell font-medium',
                    calendarClassNames?.week,
                )}
            >
                {cells}
            </tr>
        )
    })

    return (
        <table
            ref={ref}
            className={classNames(
                'picker-table border-separate border-spacing-y-1 w-full',
                calendarClassNames?.table,
                className,
            )}
            cellSpacing="0"
            {...rest}
        >
            {!hideWeekdays && (
                <thead>
                    <tr>{weekdays}</tr>
                </thead>
            )}
            <tbody>{rows}</tbody>
        </table>
    )
}

export default Month
