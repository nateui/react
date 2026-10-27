import _Calendar from './calendar'
import Range from './range'
import Mini from './mini'

export type { CalenderProps } from './calendar'
export type { RangeCalendarProps } from './range'
export type { MiniCalendarProps } from './mini'

type CompoundedComponent = typeof _Calendar & {
    Range: typeof Range
    Mini: typeof Mini
}

const Calendar = _Calendar as CompoundedComponent

Calendar.Range = Range
Calendar.Mini = Mini

export { Calendar }

export default Calendar
