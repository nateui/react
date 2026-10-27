import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _DatePicker from './date-picker'
import type { DatePickerProps } from './date-picker'
import Range from './range'
import DateTime from './date-time'

export type { DatePickerProps } from './date-picker'
export type { RangeProps } from './range'
export type { DateTimeProps } from './date-time'

type CompoundedComponent = ForwardRefExoticComponent<
    DatePickerProps & RefAttributes<HTMLSpanElement>
> & {
    Range: typeof Range
    DateTime: typeof DateTime
}

const DatePicker = _DatePicker as CompoundedComponent

DatePicker.Range = Range
DatePicker.DateTime = DateTime

export { DatePicker }

export default DatePicker
