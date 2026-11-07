/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useId, useMemo, useEffect } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { RadioGroupContextProvider } from './context'
import type { ChangeEvent, Ref, ComponentProps } from 'react'

export type RadioGroupProps = Omit<ComponentProps<'div'>, 'onChange'> & {
    radioClass?: string
    disabled?: boolean
    name?: string
    onChange?: (values: any, e: ChangeEvent<HTMLInputElement>) => void
    ref?: Ref<HTMLDivElement>
    value?: any
    vertical?: boolean
}

const Group = (props: RadioGroupProps) => {
    const {
        radioClass,
        disabled,
        name,
        onChange,
        ref,
        children,
        value: valueProp,
        vertical = false,
        className,
        ...rest
    } = props

    const generatedName = useId()
    const groupName = name ?? `radio-${generatedName}`
    const [value, setValue] = useState(valueProp)
    const { classNames: configClassNames } = useConfig()
    const radioClassNames = configClassNames?.radio

    useEffect(() => {
        if (valueProp !== value) {
            setValue(valueProp)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueProp])

    const onRadioGroupChange = useCallback(
        (nextValue: any, e: ChangeEvent<HTMLInputElement>) => {
            setValue(nextValue)
            onChange?.(nextValue, e)
        },
        [onChange, setValue],
    )

    const contextValue = useMemo(
        () => ({
            vertical,
            name: groupName,
            value: typeof value === 'undefined' ? null : value,
            radioClass,
            disabled,
            onChange: onRadioGroupChange,
        }),
        [disabled, onRadioGroupChange, vertical, groupName, radioClass, value],
    )

    const radioGroupClass = classNames(
        'radio-group inline-flex gap-4',
        vertical && 'vertical flex-col',
        radioClassNames?.group,
        className,
    )
    return (
        <RadioGroupContextProvider value={contextValue}>
            <div
                {...rest}
                ref={ref}
                className={radioGroupClass}
                role="radiogroup"
                aria-orientation={vertical ? 'vertical' : 'horizontal'}
            >
                {children}
            </div>
        </RadioGroupContextProvider>
    )
}

export default Group
