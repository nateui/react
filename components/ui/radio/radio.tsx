import { useCallback, useContext, useEffect, useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import RadioGroupContext from './context'
import type { RadioValue } from './context'
import type {
    ChangeEvent,
    ComponentPropsWithRef,
    KeyboardEvent,
    MouseEvent,
    Ref,
} from 'react'

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'onChange'> & {
    checked?: boolean
    radioClass?: string
    defaultChecked?: boolean
    disabled?: boolean
    labelRef?: Ref<HTMLLabelElement>
    name?: string
    onChange?: (value: RadioValue, e: ChangeEvent<HTMLInputElement>) => void
    ref?: Ref<HTMLInputElement>
    value?: RadioValue
    vertical?: boolean
    readOnly?: boolean
}

const Radio = (props: RadioProps) => {
    const {
        name: nameContext,
        disabled: disabledContext,
        value: groupValue,
        onChange: onGroupChange,
        radioClass: customColorContext,
    } = useContext(RadioGroupContext)
    const {
        children,
        className,
        checked: checkedProp,
        radioClass,
        defaultChecked,
        disabled = disabledContext,
        labelRef,
        name = nameContext,
        onChange,
        onClick,
        onMouseDown,
        onKeyDown,
        readOnly,
        ref,
        value,
        ...rest
    } = props

    const isGroup = typeof groupValue !== 'undefined'
    const getInitialChecked = () =>
        isGroup ? groupValue === value : checkedProp ?? defaultChecked ?? false
    const [radioChecked, setRadioChecked] = useState(getInitialChecked)
    const isChecked = isGroup ? groupValue === value : checkedProp ?? radioChecked

    useEffect(() => {
        if (!isGroup && typeof checkedProp === 'boolean') {
            setRadioChecked(checkedProp)
        }
    }, [checkedProp, isGroup])

    const restoreReadOnlyState = useCallback(
        (input: HTMLInputElement) => {
            input.checked = isChecked
        },
        [isChecked],
    )

    const onRadioChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (disabled || readOnly) {
                restoreReadOnlyState(e.currentTarget)
                return
            }

            const nextChecked = e.currentTarget.checked
            if (!isGroup) {
                setRadioChecked(nextChecked)
            }
            onGroupChange?.(value as RadioValue, e)
            onChange?.(value as RadioValue, e)
        },
        [
            disabled,
            isGroup,
            onChange,
            onGroupChange,
            readOnly,
            restoreReadOnlyState,
            value,
        ],
    )

    const handleClick = useCallback(
        (e: MouseEvent<HTMLInputElement>) => {
            onClick?.(e)
            if (disabled || readOnly) {
                e.preventDefault()
                const input = e.currentTarget
                restoreReadOnlyState(input)
                window.setTimeout(() => restoreReadOnlyState(input), 0)
            }
        },
        [disabled, onClick, readOnly, restoreReadOnlyState],
    )

    const handleMouseDown = useCallback(
        (e: MouseEvent<HTMLInputElement>) => {
            onMouseDown?.(e)
            if (disabled || readOnly) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [disabled, onMouseDown, readOnly, restoreReadOnlyState],
    )

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(e)
            if (
                !e.defaultPrevented &&
                (e.key === ' ' ||
                    e.key === 'Enter' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowDown' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') &&
                (disabled || readOnly)
            ) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [disabled, onKeyDown, readOnly, restoreReadOnlyState],
    )

    const { classNames: configClassNames } = useConfig()
    const radioClassNames = configClassNames?.radio
    const radioColor = customColorContext || 'text-primary'
    const radioDefaultClass = classNames(
        'radio peer h-4.5 w-4.5 border  rounded-full cursor-pointer inline-block align-middle flex-shrink-0 p-0 appearance-none transition-colors duration-150 ease-in-out shadow-control checked:bg-current checked:border-current focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring',
        !disabled && 'group-hover/radio:border-current',
        radioClassNames?.control,
    )
    const radioColorClass =
        disabled ?
        'disabled bg-control-disabled border-control-disabled cursor-not-allowed checked:opacity-50'
        :
        'bg-control border-control-border'
    const labelClass = classNames(
        'radio-label items-start cursor-pointer inline-flex gap-2.5 font-medium',
        'group/radio',
        disabled && 'disabled cursor-not-allowed',
        radioClassNames?.root,
        className,
    )

    return (
        <label
            ref={labelRef}
            className={labelClass}
            data-disabled={disabled ? '' : undefined}
            data-readonly={readOnly ? '' : undefined}
            data-state={isChecked ? 'checked' : 'unchecked'}
        >
            <span
                className={classNames(
                    'radio-wrapper relative flex items-center justify-center mt-0.5',
                    radioColor,
                    radioClass,
                    radioClassNames?.wrapper,
                )}
            >
                <input
                    {...rest}
                    ref={ref}
                    type="radio"
                    className={classNames(
                        radioDefaultClass,
                        radioColorClass,
                    )}
                    checked={isChecked}
                    disabled={disabled}
                    value={value}
                    name={name}
                    readOnly={readOnly}
                    aria-readonly={readOnly || undefined}
                    onChange={onRadioChange}
                    onMouseDown={handleMouseDown}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                />
                <svg
                    viewBox="0 0 16 16"
                    className={classNames(
                        'radio-check h-4.5 w-4.5 stroke-primary-foreground fill-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4',
                        radioClassNames?.indicator,
                    )}
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle cx="8" cy="8" r="3" />
                </svg>
            </span>
            {children ? (
                <span
                    className={classNames(
                        'flex-1',
                        disabled ? 'opacity-50' : '',
                        radioClassNames?.label,
                    )}
                >
                    {children}
                </span>
            ) : null}
        </label>
    )
}

export default Radio
