import Button from '../button'
import InputGroup from '../input-group/index'
import classNames from '@/utils/class-names'
import capitalize from './utils/capitalize'
import useControllableState from '@/hooks/use-controllable-state'
import { ChevronLeft, ChevronRight } from '../icons/index'
import { useConfig } from '../config-provider/index'
import { isSameDate } from './utils/index'
import dayjs from 'dayjs'
import type { ComponentProps, Ref } from 'react'

export type MiniCalendarProps = Omit<
    ComponentProps<'div'>,
    'onChange' | 'value' | 'defaultValue'
> & {
    value?: Date
    defaultValue?: Date
    onChange?: (date: Date) => void
    visibleCount?: number
    locale?: string
    weekdayFormat?: string
    monthFormat?: string
    showHeader?: boolean
    showStripNavigation?: boolean
    ref?: Ref<HTMLDivElement>
}


const navButtonClass =
    'mini-calendar-nav text-base'

const Mini = (props: MiniCalendarProps) => {
    const {
        className,
        value,
        defaultValue,
        onChange,
        visibleCount = 5,
        locale,
        weekdayFormat = 'dd',
        monthFormat = 'MMMM YYYY',
        showHeader = true,
        showStripNavigation = true,
        ref,
        ...rest
    } = props

    const { locale: themeLocale } = useConfig()
    const finalLocale = locale || themeLocale

    const [_value, setValue] = useControllableState({
        prop: value,
        defaultProp: defaultValue ?? new Date(),
        onChange,
    })

    const anchor = _value instanceof Date ? _value : new Date()
    const today = new Date()

    const half = Math.floor(visibleCount / 2)
    const days = Array.from({ length: visibleCount }, (_, index) =>
        dayjs(anchor)
            .add(index - half, 'day')
            .toDate(),
    )

    const stepDay = (amount: number) =>
        setValue(dayjs(anchor).add(amount, 'day').toDate())

    const stepMonth = (amount: number) =>
        setValue(dayjs(anchor).add(amount, 'month').startOf('month').toDate())

    return (
        <div
            ref={ref}
            className={classNames(
                'mini-calendar flex w-full flex-col gap-4',
                className,
            )}
            {...rest}
        >
            {
                showHeader && (
                    <div className="mini-calendar-header flex items-center justify-between gap-2">
                        <div className="mini-calendar-label flex-1 text-base font-medium text-foreground">
                            {capitalize(
                                dayjs(anchor).locale(finalLocale).format(monthFormat),
                            )}
                        </div>
                        <InputGroup>
                            <Button
                                type="button"
                                size="sm"
                                className={navButtonClass}
                                aria-label="Previous month"
                                onClick={() => stepMonth(-1)}
                                icon={<ChevronLeft />}
                            />
                            <Button
                                type="button"
                                size="sm"
                                className={navButtonClass}
                                aria-label="Next month"
                                onClick={() => stepMonth(1)}
                                icon={<ChevronRight />}
                            />
                        </InputGroup>
                    </div>
                )
            }
            <div className="mini-calendar-strip flex items-center gap-2">
                {showStripNavigation && (
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={navButtonClass}
                        aria-label="Previous day"
                        onClick={() => stepDay(-1)}
                        icon={<ChevronLeft />}
                    />
                )}
                <div className="mini-calendar-days flex flex-1 items-center justify-between">
                    {days.map((day, index) => {
                        const selected = isSameDate(day, anchor)
                        const isToday = isSameDate(day, today)
                        return (
                            <div className="flex flex-col items-center gap-1" key={index}>
                                <span
                                    className={classNames(
                                        'text-xs font-medium text-muted-foreground',
                                    )}
                                >
                                    {capitalize(
                                        dayjs(day)
                                            .locale(finalLocale)
                                            .format(weekdayFormat),
                                    )}
                                </span>
                                <button
                                    type="button"
                                    aria-pressed={selected}
                                    className={classNames(
                                        'mini-calendar-day flex flex-col items-center justify-center rounded-control h-8 w-8 transition-colors',
                                        selected
                                            ? 'mini-calendar-day-selected bg-primary'
                                            : 'hover:bg-accent',
                                    )}
                                    onClick={() => setValue(day)}
                                >

                                    <span
                                        className={classNames(
                                            'font-semibold text-sm',
                                            selected
                                                ? 'text-primary-foreground'
                                                : isToday
                                                ? 'text-primary'
                                                : 'text-foreground',
                                        )}
                                    >
                                        {day.getDate()}
                                    </span>
                                </button>
                            </div>

                        )
                    })}
                </div>
                {
                    showStripNavigation && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className={navButtonClass}
                            aria-label="Next day"
                            onClick={() => stepDay(1)}
                            icon={<ChevronRight />}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default Mini
