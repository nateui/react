import { useRef } from 'react'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import { useConfig } from '../config-provider/index'
import type {
    FocusEvent,
    MouseEvent,
    KeyboardEvent,
    ChangeEvent,
    ComponentPropsWithRef,
    Ref,
} from 'react'

type AmPmInputProps = Omit<ComponentPropsWithRef<'input'>, 'onChange' | 'value'> & {
    disabled?: boolean
    amLabel?: string
    onChange: (value: string, triggerShift: boolean) => void
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void
    placeholder?: string
    pmLabel?: string
    value: string | number | readonly string[]
}

const AmPmInput = (props: AmPmInputProps) => {
    const {
        className,
        onChange,
        onFocus,
        value,
        amLabel,
        pmLabel,
        ref = null,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const timeInputClassNames = configClassNames?.timeInput

    const inputRef = useRef<HTMLInputElement>(undefined)

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
        event.stopPropagation()
        inputRef?.current?.select()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(
                value === amLabel ? (pmLabel as string) : (amLabel as string),
                true,
            )
        }
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (typeof onFocus === 'function') {
            onFocus(event)
        }
        inputRef?.current?.select()
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const lastInputVal = event.target.value.slice(-1).toLowerCase()

        if (lastInputVal === 'p') {
            event.preventDefault()
            onChange(pmLabel as string, true)
            return
        }

        if (lastInputVal === 'a') {
            event.preventDefault()
            onChange(amLabel as string, true)
            return
        }

        onChange(value.toString(), true)
    }

    return (
        <input
            ref={useMergedRef(inputRef as Ref<HTMLInputElement>, ref)}
            type="text"
            value={value}
            className={classNames(
                'time-input-field ring-0 w-6 text-center outline-none bg-transparent',
                'am-pm-input',
                timeInputClassNames?.period,
                className,
            )}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            {...rest}
        />
    )
}

export default AmPmInput
