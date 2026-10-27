import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _TimeInput from './time-input'
import type { TimeInputProps } from './time-input'
import TimeInputRange from './time-input-range'

export type { TimeInputProps } from './time-input'
export type { TimeInputRangeProps } from './time-input-range'

type CompoundedComponent = ForwardRefExoticComponent<
    TimeInputProps & RefAttributes<HTMLInputElement>
> & {
    TimeInputRange: typeof TimeInputRange
}

const TimeInput = _TimeInput as CompoundedComponent

TimeInput.TimeInputRange = TimeInputRange

export { TimeInput }

export default TimeInput
