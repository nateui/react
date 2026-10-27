/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'
import dayjs from 'dayjs'
import useControllableState from '@/hooks/use-controllable-state'
import useMergedRef from '@/hooks/use-merge-ref'
import capitalize from '../calendar/utils/capitalize'
import Calendar from '../calendar/index'
import BasePicker from './base-picker'
import { useConfig } from '../config-provider/index'
import type { CalendarSharedProps } from '../calendar/calendar-base'
import type { BasePickerSharedProps } from './base-picker'
import type { ComponentProps, Ref } from 'react'

export type RangeValue = [Date | null, Date | null]

export interface RangeProps
    extends
        Omit<
            ComponentProps<'div'>,
            keyof BasePickerSharedProps | 'defaultValue' | 'onChange' | 'value'
        >,
        Omit<
            CalendarSharedProps,
            | 'onMonthChange'
            | 'onChange'
            | 'isDateInRange'
            | 'isDateFirstInRange'
            | 'isDateLastInRange'
            | 'month'
        >,
        BasePickerSharedProps {
    closePickerOnChange?: boolean
    defaultOpen?: boolean
    defaultValue?: RangeValue
    inputFormat?: string
    separator?: string
    onChange?: (value: RangeValue) => void
    openPickerOnClear?: boolean
    ref?: Ref<HTMLInputElement>
    singleDate?: boolean
    value?: RangeValue
}

const validationRule = (val: any) =>
    Array.isArray(val) &&
    val.length === 2 &&
    val.every((v) => v instanceof Date)

const isFirstDateSet = (val: any) =>
    Array.isArray(val) && val.length === 2 && val[0] instanceof Date

const Range = (props: RangeProps) => {
    const {
        className,
        clearable = true,
        clearButton,
        cellHeight,
        closePickerOnChange = true,
        dateViewCount = 1,
        dayClassName,
        dayStyle,
        defaultMonth,
        defaultOpen = false,
        defaultValue,
        defaultView,
        disabled,
        disableDate,
        enableHeaderLabel,
        disableOutOfMonth,
        firstDayOfWeek = 'monday',
        hideOutOfMonthDates,
        hideWeekdays,
        inputFormat,
        inputPrefix,
        inputSuffix,
        labelFormat = {
            month: 'MMM',
            year: 'YYYY',
        },
        separator = '~',
        locale,
        lockView,
        maxDate,
        minDate,
        onChange,
        onDropdownClose,
        onDropdownOpen,
        openPickerOnClear = false,
        ref = null,
        renderDay,
        singleDate = false,
        size,
        style,
        value,
        weekendDays,
        yearLabelFormat,
        ...rest
    } = props

    const { classNames: configClassNames, locale: themeLocale } = useConfig()
    const datePickerClassNames = configClassNames?.datePicker

    const finalLocale = locale || themeLocale

    const dateFormat = inputFormat || 'YYYY-MM-DD'

    const [dropdownOpened, setDropdownOpened] = useState(defaultOpen)

    const inputRef = useRef<HTMLInputElement>(null)

    const [_value, setValue] = useControllableState<[Date | null, Date | null]>(
        {
            prop: value,
            defaultProp:
                defaultValue !== undefined ? defaultValue : [null, null],
            onChange,
        },
    )

    const handleValueChange = (range: [Date, Date]) => {
        setValue(range)
        if (closePickerOnChange && validationRule(range)) {
            setDropdownOpened(false)
            onDropdownClose?.()
            window.setTimeout(() => inputRef.current?.focus(), 0)
        }
    }

    const valueValid = validationRule(_value)
    const firstValueValid = isFirstDateSet(_value)

    const firstDateLabel = _value?.[0]
        ? capitalize(dayjs(_value[0]).locale(finalLocale).format(dateFormat))
        : ''

    const secondDateLabel = _value?.[1]
        ? capitalize(dayjs(_value[1]).locale(finalLocale).format(dateFormat))
        : ''

    const handleClear = () => {
        setValue([null, null])
        setDropdownOpened(true)
        if (openPickerOnClear && onDropdownOpen) {
            onDropdownOpen()
        }
        inputRef.current?.focus()
    }

    const handleDropdownToggle = (isOpened: boolean) => {
        if (!isOpened && firstValueValid && _value?.[1] === null) {
            handleClear()
        }
        setDropdownOpened(isOpened)
    }

    return (
        <BasePicker
            ref={useMergedRef(ref, inputRef)}
            dropdownOpened={dropdownOpened as boolean}
            setDropdownOpened={handleDropdownToggle}
            size={size}
            style={style}
            className={className}
            inputLabel={
                firstValueValid
                    ? `${firstDateLabel} ${separator} ${secondDateLabel}`
                    : ''
            }
            clearable={clearable && firstValueValid}
            clearButton={clearButton}
            disabled={disabled}
            inputPrefix={inputPrefix}
            inputSuffix={inputSuffix}
            onClear={handleClear}
            onDropdownClose={onDropdownClose}
            onDropdownOpen={onDropdownOpen}
            {...rest}
        >
            <Calendar.Range
                className={datePickerClassNames?.calendar}
                locale={finalLocale}
                defaultMonth={(valueValid ? _value?.[0] : defaultMonth) as Date}
                value={_value as [Date | null, Date | null]}
                labelFormat={labelFormat}
                dayClassName={dayClassName}
                dayStyle={dayStyle}
                disableOutOfMonth={disableOutOfMonth}
                minDate={minDate}
                maxDate={maxDate}
                disableDate={disableDate}
                firstDayOfWeek={firstDayOfWeek}
                enableHeaderLabel={enableHeaderLabel}
                singleDate={singleDate}
                dateViewCount={dateViewCount}
                cellHeight={cellHeight}
                defaultView={defaultView}
                hideOutOfMonthDates={hideOutOfMonthDates}
                hideWeekdays={hideWeekdays}
                renderDay={renderDay}
                weekendDays={weekendDays}
                yearLabelFormat={yearLabelFormat}
                lockView={lockView}
                onChange={(date) => handleValueChange(date as [Date, Date])}
            />
        </BasePicker>
    )
}

export default Range
