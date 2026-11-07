import { useState } from 'react'
import dayjs from 'dayjs'
import { isSameDate } from './utils/is-same-date'
import CalendarBase from './calendar-base'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { CalendarSharedProps } from './calendar-base'
import type { Modifiers } from './tables/components/types'
import type { ComponentProps, Ref } from 'react'

export type RangeCalendarProps = Omit<ComponentProps<'div'>, 'onChange' | 'value'> &
    Omit<
        CalendarSharedProps,
        | 'value'
        | 'isDateInRange'
        | 'isDateFirstInRange'
        | 'isDateLastInRange'
    > & {
        value: [Date | null, Date | null]
        onChange: (value: [Date | null, Date | null]) => void
        ref?: Ref<HTMLDivElement>
        singleDate?: boolean
    }

const RangeCalendar = (props: RangeCalendarProps) => {
    const {
        value,
        onChange,
        className,
        dayStyle,
        singleDate = false,
        dateViewCount = 1,
        paginateBy,
        ref,
        ...rest
    } = props

    const [hoveredDay, setHoveredDay] = useState<Date | null>(null)
    const [pickedDate, setPickedDate] = useState<Date | null>(null)
    const { classNames: configClassNames } = useConfig()
    const rangeCalendarClassNames = configClassNames?.rangeCalendar

    const setRangeDate = (date: Date) => {
        if (pickedDate instanceof Date) {
            if (isSameDate(date, pickedDate) && !singleDate) {
                setPickedDate(null)
                setHoveredDay(null)
                return null
            }

            const result: [Date, Date] = [date, pickedDate]
            result.sort((a, b) => a.getTime() - b.getTime())
            onChange(result)
            setPickedDate(null)
            return null
        }

        if (value[0] && isSameDate(date, value[0]) && !singleDate) {
            setPickedDate(null)
            setHoveredDay(null)
            onChange([null, null])
            return null
        }

        onChange([date, null])
        setPickedDate(date)
        return null
    }

    const shouldHighlightDate = (date: Date, modifiers: Modifiers) => {
        if (pickedDate instanceof Date && hoveredDay instanceof Date) {
            const result = [hoveredDay, pickedDate]
            result.sort((a, b) => a.getTime() - b.getTime())
            return (
                !modifiers.selected &&
                dayjs(date).subtract(1, 'day').isBefore(result[1]) &&
                dayjs(date).add(1, 'day').isAfter(result[0])
            )
        }

        return false
    }

    const isPickedDateFirstInRange = (date: Date, modifiers: Modifiers) => {
        if (pickedDate instanceof Date && hoveredDay instanceof Date) {
            const result = [hoveredDay, pickedDate]
            result.sort((a, b) => a.getTime() - b.getTime())
            return modifiers.selected && dayjs(date).isBefore(result[1])
        }

        return false
    }

    const isPickedDateLastInRange = (date: Date, modifiers: Modifiers) => {
        if (pickedDate instanceof Date && hoveredDay instanceof Date) {
            const result = [hoveredDay, pickedDate]
            result.sort((a, b) => a.getTime() - b.getTime())
            return modifiers.selected && dayjs(date).isAfter(result[0])
        }

        return false
    }

    return (
        <CalendarBase
            ref={ref}
            className={classNames(
                rangeCalendarClassNames?.root,
                rangeCalendarClassNames?.view,
                className,
            )}
            dayStyle={dayStyle}
            value={pickedDate}
            range={value as [Date, Date]}
            dateViewCount={dateViewCount}
            paginateBy={paginateBy || dateViewCount}
            hideOutOfMonthDates={(dateViewCount as number) > 1}
            isDateInRange={shouldHighlightDate}
            isDateFirstInRange={isPickedDateFirstInRange}
            isDateLastInRange={isPickedDateLastInRange}
            onDayMouseEnter={(date) => setHoveredDay(date)}
            onChange={(date) => setRangeDate(date as Date)}
            {...rest}
        />
    )
}

export default RangeCalendar
