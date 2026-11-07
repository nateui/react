import { useState, useRef, useId } from 'react'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import useDidUpdate from './hooks/use-did-update'
import TimeInput from './time-input'
import { ClockIcon } from '../icons/index'
import CloseButton from '../close-button'
import { InputWrapper } from '../input/index'
import { useConfig } from '../config-provider/index'
import type { TypeAttributes } from '../config-provider/types'
import type { RefObject, ComponentPropsWithRef, Ref, ReactNode } from 'react'

type Value = [Date | null, Date | null]

export type TimeInputRangeProps = Omit<
    ComponentPropsWithRef<'span'>,
    'onChange' | 'prefix' | 'ref' | 'suffix' | 'defaultValue' | 'value'
> & {
    amLabel?: string
    amPmPlaceholder?: string
    clearable?: boolean
    defaultValue?: Value
    disabled?: boolean
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
    seperator?: string
    size?: TypeAttributes.ControlSize
    suffix?: string | ReactNode
    timeFieldPlaceholder?: string
    timeFieldClass?: string
    value?: Value
}

const TimeInputRange = (props: TimeInputRangeProps) => {
    const {
        amPmPlaceholder = 'am',
        clearable = false,
        className,
        defaultValue = [null, null],
        disabled = false,
        format = '24',
        id,
        invalid,
        name,
        onChange,
        prefix,
        ref = null,
        seperator = '~',
        showSeconds = false,
        size: sizeProp,
        style,
        suffix = <ClockIcon className="text-lg" />,
        timeFieldPlaceholder = '--',
        timeFieldClass,
        value,
        ...rest
    } = props

    const reactId = useId()
    const uuid = id ? `${id}-${reactId}` : reactId
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const timeInputClassNames = configClassNames?.timeInput
    const size = sizeProp ?? componentDefaults?.timeInput?.size ?? 'md'

    const fromTimeRef = useRef<HTMLInputElement>(undefined)
    const toTimeRef = useRef<HTMLInputElement>(undefined)
    const [_value, setValue] = useState(
        (value ?? defaultValue) as [Date | null, Date | null],
    )

    useDidUpdate(() => {
        if (typeof onChange === 'function') {
            onChange(_value)
        }
    }, [_value])

    useDidUpdate(() => {
        if (
            value &&
            (value[0]?.getTime() !== _value[0]?.getTime() ||
                value[1]?.getTime() !== _value[1]?.getTime())
        ) {
            setValue(value)
        }
    }, [value])

    const handleClear = () => {
        setValue([null, null])
        fromTimeRef.current?.focus()
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
            <>{suffix}</>
        )
    const prefixSlot =
        timeInputClassNames?.prefix && prefix ? (
            <span className={timeInputClassNames.prefix}>{prefix}</span>
        ) : (
            prefix
        )

    const forwardProps = {
        amPmPlaceholder,
        disabled,
        format,
        size,
        timeFieldClass,
        timeFieldPlaceholder,
        showSeconds,
    }

    return (
        <InputWrapper
            invalid={invalid}
            size={size}
            className={classNames(timeInputClassNames?.root, className)}
            style={style}
            disabled={disabled}
            suffix={suffixSlot}
            prefix={prefixSlot}
            onClick={() => {
                fromTimeRef.current?.focus()
            }}
            {...rest}
        >
            <div
                className={classNames(
                    'time-input-wrapper flex h-full min-w-0 flex-1 items-center',
                    timeInputClassNames?.wrapper,
                )}
            >
                <div className="inline-flex rtl:flex-row-reverse rtl:justify-end">
                    <TimeInput
                        ref={useMergedRef(
                            fromTimeRef as Ref<HTMLInputElement>,
                            ref,
                        )}
                        embedded
                        value={_value[0]}
                        name={name}
                        nextRef={toTimeRef as RefObject<HTMLInputElement | null>}
                        id={uuid}
                        clearable={false}
                        suffix={null}
                        onChange={(date) => setValue([date, _value[1]])}
                        {...forwardProps}
                    />
                    <span
                        className={classNames(
                            'time-input-separator mx-2',
                            timeInputClassNames?.separator,
                        )}
                    >
                        {seperator}
                    </span>
                    <TimeInput
                        ref={toTimeRef as Ref<HTMLInputElement>}
                        embedded
                        value={_value[1]}
                        clearable={false}
                        suffix={null}
                        onChange={(date) => setValue([_value[0], date])}
                        {...forwardProps}
                    />
                </div>
            </div>
        </InputWrapper>
    )
}

export default TimeInputRange
