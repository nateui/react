import { useState, useCallback, useMemo, useEffect } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { CheckboxGroupContextProvider } from './context'
import type { CheckboxGroupValue, CheckboxValue } from './context'
import type { SyntheticEvent, ComponentPropsWithRef } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
const hasOwnProperty = Object.prototype.hasOwnProperty

function is(x: any, y: any) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    }

    return x !== x && y !== y
}

function shallowEqual(objA: any, objB: any) {
    if (is(objA, objB)) {
        return true
    }

    if (
        typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
    ) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    for (let i = 0; i < keysA.length; i += 1) {
        if (
            !hasOwnProperty.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false
        }
    }

    return true
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type CheckboxGroupProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
    checkboxClass?: string
    name?: string
    onChange?: (value: CheckboxGroupValue, event: SyntheticEvent) => void
    value?: CheckboxGroupValue
    vertical?: boolean
}

const Group = (props: CheckboxGroupProps) => {
    const {
        children,
        className,
        checkboxClass,
        name,
        onChange,
        ref,
        value: valueProp,
        vertical,
        ...rest
    } = props

    const [value, setValue] = useState<CheckboxGroupValue>(valueProp ?? [])
    const { classNames: configClassNames } = useConfig()
    const checkboxClassNames = configClassNames?.checkbox

    const onCheckboxGroupChange = useCallback(
        (
            itemValue: CheckboxValue,
            itemChecked: boolean,
            event: SyntheticEvent,
        ) => {
            const nextValue = [...value]
            if (itemChecked) {
                nextValue.push(itemValue as never)
            } else {
                for (let i = nextValue.length - 1; i >= 0; i -= 1) {
                    if (shallowEqual(nextValue[i], itemValue)) {
                        nextValue.splice(i, 1)
                    }
                }
            }

            setValue(nextValue)
            onChange?.(nextValue, event)
        },
        [onChange, setValue, value],
    )

    useEffect(() => {
        setValue(valueProp ?? [])
    }, [valueProp])

    const contextValue = useMemo(
        () => ({
            vertical,
            name,
            value,
            checkboxClass,
            onChange: onCheckboxGroupChange,
        }),
        [vertical, onCheckboxGroupChange, name, checkboxClass, value],
    )

    return (
        <CheckboxGroupContextProvider value={contextValue}>
            <div
                {...rest}
                ref={ref}
                className={classNames(
                    'inline-flex gap-4',
                    vertical ? 'flex-col' : '',
                    checkboxClassNames?.group,
                    className,
                )}
                role="group"
            >
                {children}
            </div>
        </CheckboxGroupContextProvider>
    )
}

export default Group
