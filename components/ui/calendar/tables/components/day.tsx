import classNames from '@/utils/class-names'
import { useConfig } from '../../../config-provider/index'
import type { ComponentPropsWithRef, ReactNode, MouseEvent, Ref } from 'react'

export interface DayProps
    extends
        Omit<ComponentPropsWithRef<'button'>, 'value' | 'onMouseEnter'> {
    value: Date
    selected: boolean
    weekend: boolean
    outOfMonth: boolean
    onMouseEnter: (date: Date, event: MouseEvent<HTMLButtonElement>) => void
    hasValue: boolean
    inRange: boolean
    firstInRange: boolean
    lastInRange: boolean
    isToday: boolean
    fullWidth: boolean
    firstInMonth: boolean
    focusable: boolean
    hideOutOfMonthDates?: boolean
    ref?: Ref<HTMLButtonElement>
    renderDay?: (date: Date) => ReactNode
    disabled: boolean
}

function getDayTabIndex({
    focusable,
    hasValue,
    selected,
    firstInMonth,
}: {
    focusable: boolean
    hasValue: boolean
    selected: boolean
    firstInMonth: boolean
}) {
    if (!focusable) {
        return -1
    }

    if (hasValue) {
        return selected ? 0 : -1
    }

    return firstInMonth ? 0 : -1
}

const Day = (props: DayProps) => {
    const {
        className,
        value,
        selected,
        weekend,
        outOfMonth,
        onMouseEnter,
        hasValue,
        firstInRange,
        lastInRange,
        inRange,
        isToday,
        firstInMonth,
        focusable,
        hideOutOfMonthDates,
        ref,
        renderDay,
        disabled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fullWidth,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const calendarClassNames = configClassNames?.calendar

    return (
        <button
            {...rest}
            ref={ref}
            type="button"
            disabled={disabled}
            tabIndex={getDayTabIndex({
                focusable,
                hasValue,
                selected,
                firstInMonth,
            })}
            className={classNames(
                'date-picker-cell-content h-full w-full',
                disabled && 'date-picker-cell-disabled opacity-30 cursor-not-allowed',

                weekend && !disabled && 'date-picker-cell-weekend',
                outOfMonth &&
                    !disabled &&
                    'date-picker-other-month text-muted-foreground',
                outOfMonth && hideOutOfMonthDates && 'd-none',
                !outOfMonth &&
                    !disabled &&
                    !selected &&
                    'date-picker-cell-current-month text-foreground',
                isToday && `date-picker-today text-primary`,
                !disabled &&
                    !selected &&
                    !inRange &&
                    'date-picker-cell-hoverable hover:bg-accent hover:text-accent-foreground',
                selected &&
                    !disabled &&
                    'date-picker-cell-selected bg-primary text-primary-foreground',
                inRange &&
                    !disabled &&
                    !firstInRange &&
                    !lastInRange &&
                    !selected &&
                    'date-picker-cell-inrange bg-primary-soft hover:text-primary',
                !inRange && !firstInRange && !lastInRange && 'rounded-control',
                inRange &&
                    isToday &&
                    "date-picker-cell-inrange-today relative rounded-control bg-transparent before:content-[''] before:absolute before:bg-primary-soft before:w-full before:h-full before:left-0 before:top-0",
                firstInRange &&
                    !disabled &&
                    "date-picker-cell-selected-start bg-primary relative rounded-control before:content-[''] before:absolute before:bg-primary-soft before:w-full before:h-full before:left-0 before:top-0 ltr:before:rounded-tl-lg ltr:before:rounded-bl-lg rtl:before:rounded-tr-lg rtl:before:rounded-br-lg",
                lastInRange &&
                    !disabled &&
                    "date-picker-cell-selected-end relative rounded-control before:content-[''] before:absolute before:bg-primary-soft before:w-full before:h-full before:left-0 before:top-0 ltr:before:rounded-tr-lg ltr:before:rounded-br-lg rtl:before:rounded-tl-lg rtl:before:rounded-bl-lg",
                calendarClassNames?.day,
                className,
            )}
            data-disabled={disabled ? '' : undefined}
            data-state={selected ? 'selected' : undefined}
            data-in-range={inRange ? '' : undefined}
            data-range-start={firstInRange ? '' : undefined}
            data-range-end={lastInRange ? '' : undefined}
            data-today={isToday ? '' : undefined}
            data-outside-month={outOfMonth ? '' : undefined}
            onMouseEnter={(event) => onMouseEnter(value, event)}
        >
            {typeof renderDay === 'function'
                ? renderDay(value)
                : value?.getDate()}
        </button>
    )
}

export default Day
