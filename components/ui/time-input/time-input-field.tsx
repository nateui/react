import { useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import { useConfig } from '../config-provider/index'
import { padTime, createTimeHandler } from './utils/index'
import { clamp } from './utils/clamp'
import type {
    FocusEvent,
    Ref,
    KeyboardEvent,
    MouseEvent,
    ChangeEvent,
    ComponentPropsWithRef,
} from 'react'

type TimeInputFieldProps = Omit<ComponentPropsWithRef<'input'>, 'onChange'> & {
    disabled?: boolean
    id?: string
    name?: string
    max?: number
    min?: number
    onChange: ReturnType<typeof createTimeHandler>
    onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void
    onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    ref?: Ref<HTMLInputElement>
    setValue: (value: string) => void
    withSeparator?: boolean
    value: string | number | readonly string[]
}

const TimeInputField = (props: TimeInputFieldProps) => {
    const {
        className,
        onFocus,
        onBlur,
        onChange,
        ref = null,
        setValue,
        withSeparator = false,
        max,
        min = 0,
        value,
        ...rest
    } = props

    const [digitsEntered, setDigitsEntered] = useState(0)
    const { classNames: configClassNames } = useConfig()
    const timeInputClassNames = configClassNames?.timeInput

    const inputRef = useRef<HTMLInputElement>(undefined)

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (typeof onFocus === 'function') {
            onFocus(event)
        }
        inputRef?.current?.select()
        setDigitsEntered(0)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
        if (typeof onBlur === 'function') {
            onBlur(event)
        }
        if (digitsEntered === 1) {
            if (typeof onChange === 'function') {
                onChange(event.currentTarget.value, false)
            }
        }
    }

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
        event.stopPropagation()
        inputRef?.current?.select()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault()
            const padded = padTime(
                clamp(
                    parseInt(event.currentTarget.value, 10) + 1,
                    min,
                    max as number,
                ).toString(),
            )

            if (value !== padded) {
                onChange(padded, false)
            }
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            const padded = padTime(
                clamp(
                    parseInt(event.currentTarget.value, 10) - 1,
                    min,
                    max as number,
                ).toString(),
            )

            if (value !== padded) {
                onChange(padded, false)
            }
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDigitsEntered(digitsEntered + 1)

        const _val = parseInt(event.currentTarget.value, 10).toString()

        if (_val === '0' && digitsEntered === 0) {
            setValue('00')
            return
        }
        onChange(_val, true, digitsEntered > 0)
    }

    return (
        <>
            <input
                ref={useMergedRef(inputRef as Ref<HTMLInputElement>, ref)}
                type="text"
                inputMode="numeric"
                value={value}
                className={classNames(
                    'time-input-field ring-0 w-6 text-center outline-none bg-transparent',
                    timeInputClassNames?.field,
                    className,
                )}
                data-disabled={rest.disabled ? '' : undefined}
                onChange={handleChange}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                {...rest}
            />
            {withSeparator && (
                <span className={timeInputClassNames?.separator}> : </span>
            )}
        </>
    )
}

export default TimeInputField
