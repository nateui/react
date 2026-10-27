import { useState, useRef, useId } from 'react'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import useDidUpdate from './hooks/use-did-update'
import { mergeDescribedBy, useFormField } from '../form/context'
import { useConfig } from '../config-provider/index'
import TimeInputField from './time-input-field'
import AmPmInput from './am-pm-input'
import { ClockIcon } from '../icons/index'
import CloseButton from '../close-button'
import { InputWrapper } from '../input/index'
import {
    getTimeValues,
    getDate,
    createAmPmHandler,
    createTimeHandler,
} from './utils/index'
import type { TypeAttributes } from '../config-provider/types'
import type { ReactNode, RefObject, Ref, ComponentPropsWithRef } from 'react'

type Value = Date | null

export type TimeInputProps = Omit<
    ComponentPropsWithRef<'span'>,
    'defaultValue' | 'onChange' | 'prefix' | 'ref' | 'value'
> & {
    amLabel?: string
    amPmPlaceholder?: string
    clearable?: boolean
    defaultValue?: Value
    disabled?: boolean
    embedded?: boolean
    format?: '12' | '24'
    id?: string
    invalid?: boolean
    name?: string
    nextRef?: RefObject<HTMLInputElement | null>
    onChange?: (value: Value) => void
    pmLabel?: string
    prefix?: string | ReactNode
    ref?: Ref<HTMLInputElement>
    showSeconds?: boolean
    size?: TypeAttributes.ControlSize
    suffix?: string | ReactNode
    timeFieldPlaceholder?: string
    timeFieldClass?: string
    value?: Value
}

const TimeInput = (props: TimeInputProps) => {
    const {
        amLabel = 'am',
        amPmPlaceholder = 'am',
        className,
        clearable = true,
        defaultValue,
        disabled = false,
        embedded = false,
        format = '24',
        id,
        invalid,
        name,
        nextRef,
        onChange,
        pmLabel = 'pm',
        prefix,
        ref = null,
        showSeconds = false,
        size: sizeProp,
        style,
        suffix = <ClockIcon className="text-lg" />,
        timeFieldPlaceholder = '--',
        timeFieldClass,
        value,
        'aria-describedby': ariaDescribedByProp,
        'aria-invalid': ariaInvalidProp,
        'aria-label': ariaLabelProp,
        'aria-labelledby': ariaLabelledByProp,
        ...rest
    } = props

    const formField = useFormField()
    const generatedId = useId()
    const uuid = id ?? formField?.controlId ?? `time-input-${generatedId}`

    const hoursRef = useRef<HTMLInputElement>(undefined)
    const minutesRef = useRef<HTMLInputElement>(undefined)
    const secondsRef = useRef<HTMLInputElement>(undefined)
    const amPmRef = useRef<HTMLInputElement>(undefined)
    const [time, setTime] = useState(
        getTimeValues(
            value || (defaultValue as Date),
            format,
            amLabel,
            pmLabel,
        ),
    )
    const [_value, setValue] = useState<Value>(
        (value as Date) || (defaultValue as Date),
    )

    const formFieldInvalid = formField?.invalid
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const timeInputClassNames = configClassNames?.timeInput
    const size = sizeProp ?? componentDefaults?.timeInput?.size ?? 'md'
    const isTimeInputInvalid = invalid || formFieldInvalid
    const ariaDescribedBy = mergeDescribedBy(
        ariaDescribedByProp,
        formField?.describedBy,
    )
    const ariaLabelledBy =
        ariaLabelledByProp ?? (!ariaLabelProp ? formField?.labelId : undefined)

    useDidUpdate(() => {
        setTime(getTimeValues(_value as Date, format, amLabel, pmLabel))
    }, [_value, format, amLabel, pmLabel])

    useDidUpdate(() => {
        if (value?.getTime() !== _value?.getTime()) {
            setValue(value as Date | null)
        }
    }, [value])

    const setDate = (change: Partial<typeof time>) => {
        const timeWithChange = { ...time, ...change }
        const newDate = getDate(
            timeWithChange.hours,
            timeWithChange.minutes,
            timeWithChange.seconds,
            format,
            pmLabel,
            timeWithChange.amPm,
        )
        setValue(newDate)
        if (typeof onChange === 'function') {
            onChange(newDate)
        }
    }

    const handleHoursChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                hours: val,
                minutes: carryOver ?? time.minutes,
            })
        },
        min: format === '12' ? 1 : 0,
        max: format === '12' ? 12 : 23,
        nextRef: minutesRef as RefObject<HTMLInputElement | null>,
        nextMax: 59,
    })

    const handleMinutesChange = createTimeHandler({
        onChange: (val, carryOver) => {
            setDate({
                minutes: val,
                seconds: carryOver ?? time.seconds,
            })
        },
        min: 0,
        max: 59,
        nextRef: showSeconds
            ? (secondsRef as RefObject<HTMLInputElement | null>)
            : format === '12'
              ? (amPmRef as RefObject<HTMLInputElement | null>)
              : (nextRef as RefObject<HTMLInputElement | null>),
        nextMax: showSeconds ? 59 : undefined,
    })

    const handleSecondsChange = createTimeHandler({
        onChange: (val) => {
            setDate({ seconds: val })
        },
        min: 0,
        max: 59,
        nextRef:
            format === '12'
                ? (amPmRef as RefObject<HTMLInputElement | null>)
                : (nextRef as RefObject<HTMLInputElement | null>),
    })

    const handleAmPmChange = createAmPmHandler({
        amLabel,
        pmLabel,
        onChange: (val) => {
            setDate({ amPm: val })
        },
        nextRef,
    })

    const handleClear = () => {
        setTime({ hours: '', minutes: '', seconds: '', amPm: '' })
        setValue(null)
        onChange?.(null)
        hoursRef?.current?.focus()
    }

    const suffixSlot =
        clearable && _value ? (
            <CloseButton
                className={
                    classNames(
                        'p-1 text-sm',
                        timeInputClassNames?.clearButton
                    )
                }
                onClick={handleClear}
                aria-label="clear time input"
            />
        ) : timeInputClassNames?.suffix && suffix ? (
            <span className={timeInputClassNames.suffix}>{suffix}</span>
        ) : (
            suffix
        )
    const prefixSlot =
        timeInputClassNames?.prefix && prefix ? (
            <span className={timeInputClassNames.prefix}>{prefix}</span>
        ) : (
            prefix
        )

    const timeInputContent = (
        <div
            className={classNames(
                'time-input-wrapper flex h-full min-w-0 flex-1 items-center rtl:flex-row-reverse rtl:justify-end',
                timeInputClassNames?.wrapper,
                embedded && className,
            )}
        >
            <TimeInputField
                ref={useMergedRef(hoursRef as Ref<HTMLInputElement>, ref)}
                withSeparator
                value={time.hours}
                setValue={(val) =>
                    setTime((current) => ({ ...current, hours: val }))
                }
                id={uuid}
                className={timeFieldClass}
                max={format === '12' ? 12 : 23}
                placeholder={timeFieldPlaceholder}
                aria-label={ariaLabelProp ?? (formField ? undefined : 'hours')}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-invalid={
                    isTimeInputInvalid ? true : ariaInvalidProp
                }
                disabled={disabled}
                name={name}
                onChange={handleHoursChange}
            />
            <TimeInputField
                ref={minutesRef as Ref<HTMLInputElement>}
                value={time.minutes}
                setValue={(val) =>
                    setTime((current) => ({ ...current, minutes: val }))
                }
                className={timeFieldClass}
                withSeparator={showSeconds}
                max={59}
                placeholder={timeFieldPlaceholder}
                aria-label="minutes"
                disabled={disabled}
                onChange={handleMinutesChange}
            />
            {showSeconds && (
                <TimeInputField
                    ref={secondsRef as Ref<HTMLInputElement>}
                    value={time.seconds}
                    setValue={(val) =>
                        setTime((current) => ({ ...current, seconds: val }))
                    }
                    className={timeFieldClass}
                    max={59}
                    placeholder={timeFieldPlaceholder}
                    aria-label="seconds"
                    disabled={disabled}
                    onChange={handleSecondsChange}
                />
            )}
            {format === '12' && (
                <AmPmInput
                    ref={amPmRef as Ref<HTMLInputElement>}
                    value={time.amPm}
                    placeholder={amPmPlaceholder}
                    amLabel={amLabel}
                    pmLabel={pmLabel}
                    aria-label="am pm"
                    disabled={disabled}
                    onChange={handleAmPmChange}
                />
            )}
        </div>
    )

    if (embedded) {
        return timeInputContent
    }

    return (
        <InputWrapper
            invalid={isTimeInputInvalid}
            disabled={disabled}
            style={style}
            className={classNames(timeInputClassNames?.root, className)}
            size={size}
            prefix={prefixSlot}
            suffix={suffixSlot}
            onClick={() => hoursRef?.current?.focus()}
            {...rest}
        >
            {timeInputContent}
        </InputWrapper>
    )
}

export default TimeInput
