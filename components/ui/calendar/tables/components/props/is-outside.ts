import { isSameMonth } from '../../../utils/index'

export default function isOutside(date: Date, month: Date) {
    return !isSameMonth(date, month)
}
