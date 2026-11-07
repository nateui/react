import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import useMergedRef from '@/hooks/use-merge-ref'
import { useConfig } from '../config-provider/index'
import CheckboxGroupContext from './context'
import type { CheckboxValue } from './context'
import type {
    ChangeEvent,
    ComponentPropsWithRef,
    FormEvent,
    KeyboardEvent,
    MouseEvent,
    Ref,
} from 'react'

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'onChange'> & {
    checked?: boolean
    checkboxClass?: string
    contentClass?: string
    defaultChecked?: boolean
    disabled?: boolean
    indeterminate?: boolean
    labelRef?: Ref<HTMLLabelElement>
    name?: string
    onChange?: (values: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    value?: CheckboxValue
}

const Checkbox = (props: CheckboxProps) => {
    const {
        name: nameContext,
        value: groupValue,
        onChange: onGroupChange,
        checkboxClass: checkboxClassContext,
    } = useContext(CheckboxGroupContext)
    const {
        checked: controlledChecked,
        className,
        checkboxClass,
        contentClass,
        onChange,
        onClick,
        onMouseDown,
        onKeyDown,
        children,
        disabled,
        indeterminate = false,
        readOnly,
        name = nameContext,
        defaultChecked,
        value,
        labelRef,
        ref,
        ...rest
    } = props

    const isGroup = Array.isArray(groupValue) && typeof value !== 'undefined'
    const getInitialChecked = () =>
        isGroup
            ? groupValue.includes(value as string)
            : controlledChecked ?? defaultChecked ?? false
    const [checkboxChecked, setCheckboxChecked] = useState(getInitialChecked)
    const isChecked = isGroup
        ? groupValue.includes(value as string)
        : controlledChecked ?? checkboxChecked
    const inputElementRef = useRef<HTMLInputElement | null>(null)
    const inputRef = useMergedRef<HTMLInputElement>(ref ?? null, inputElementRef)

    useEffect(() => {
        if (!isGroup && typeof controlledChecked === 'boolean') {
            setCheckboxChecked(controlledChecked)
        }
    }, [controlledChecked, isGroup])

    useEffect(() => {
        const input = inputElementRef.current
        if (input) {
            input.indeterminate = indeterminate
        }
    }, [indeterminate])

    const restoreReadOnlyState = useCallback(
        (input: HTMLInputElement) => {
            input.checked = isChecked
            input.indeterminate = indeterminate
        },
        [indeterminate, isChecked],
    )

    const onCheckboxChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (disabled || readOnly) {
                restoreReadOnlyState(e.currentTarget)
                return
            }

            const nextChecked = e.currentTarget.checked
            if (!isGroup) {
                setCheckboxChecked(nextChecked)
            }
            onChange?.(nextChecked, e)
            if (isGroup) {
                onGroupChange?.(value as CheckboxValue, nextChecked, e)
            }
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

    const handleInput = useCallback(
        (e: FormEvent<HTMLInputElement>) => {
            if (disabled || readOnly) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [disabled, readOnly, restoreReadOnlyState],
    )

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(e)
            if (
                !e.defaultPrevented &&
                (e.key === ' ' || e.key === 'Enter') &&
                (disabled || readOnly)
            ) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [disabled, onKeyDown, readOnly, restoreReadOnlyState],
    )

    const handleLabelClick = useCallback(
        (e: MouseEvent<HTMLLabelElement>) => {
            if (disabled || readOnly) {
                e.preventDefault()
                const input = inputElementRef.current
                if (input) {
                    restoreReadOnlyState(input)
                    window.setTimeout(
                        () => restoreReadOnlyState(input),
                        0,
                    )
                }
            }
        },
        [disabled, readOnly, restoreReadOnlyState],
    )

    const { classNames: configClassNames } = useConfig()
    const checkboxClassNames = configClassNames?.checkbox
    const checkboxColor = classNames(
        'text-primary',
        checkboxClass || checkboxClassContext,
    )
    const checkboxDefaultClass = classNames(
        'checkbox peer h-4.5 w-4.5 border rounded-sm cursor-pointer inline-block align-middle flex-shrink-0 p-0 appearance-none transition-colors duration-150 ease-in-out shadow-control checked:bg-current checked:ring-current checked:border-current focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring',
        checkboxColor,
        !disabled &&
            'group-hover/checkbox:ring-current group-hover/checkbox:border-current',
        checkboxClassNames?.control,
    )
    const checkboxColorClass =
        disabled ? 'bg-control-disabled border-control-disabled cursor-not-allowed checked:opacity-50' : 'bg-control border-control border-control-border ring-control-border'
    const labelClass = classNames(
        'checkbox-label inline-flex cursor-pointer gap-2.5 font-medium',
        'group/checkbox',
        disabled && 'disabled cursor-not-allowed',
        checkboxClassNames?.root,
        className,
    )

    return (
        <label
            ref={labelRef}
            onClick={handleLabelClick}
            className={labelClass}
            data-disabled={disabled ? '' : undefined}
            data-readonly={readOnly ? '' : undefined}
            data-state={
                indeterminate ? 'mixed' : isChecked ? 'checked' : 'unchecked'
            }
        >
            <span
                className={classNames(
                    'checkbox-wrapper relative flex items-center h-5.5',
                    checkboxClassNames?.wrapper,
                )}
            >
                <input
                    {...rest}
                    ref={inputRef}
                    className={classNames(
                        checkboxDefaultClass,
                        checkboxColorClass,
                    )}
                    type="checkbox"
                    checked={isChecked}
                    disabled={disabled}
                    readOnly={readOnly}
                    name={name}
                    value={
                        typeof value === 'boolean' ? String(value) : value
                    }
                    aria-checked={indeterminate ? 'mixed' : undefined}
                    aria-readonly={readOnly || undefined}
                    onChange={onCheckboxChange}
                    onInput={handleInput}
                    onMouseDown={handleMouseDown}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={classNames(
                        'checkbox-check h-3.5 w-3.5 stroke-primary-foreground fill-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4',
                        indeterminate && 'opacity-100',
                        checkboxClassNames?.indicator,
                    )}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                >
                    {indeterminate ? (
                        <path
                            fillRule="evenodd"
                            d="M5 10a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
                            clipRule="evenodd"
                        />
                    ) : (
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                            clipRule="evenodd"
                        />
                    )}
                </svg>
            </span>
            {children ? (
                <span
                    className={classNames(
                        contentClass,
                        disabled ? 'opacity-50' : '',
                        checkboxClassNames?.content,
                    )}
                >
                    {children}
                </span>
            ) : null}
        </label>
    )
}

export default Checkbox
