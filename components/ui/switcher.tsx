import { useCallback, useEffect, useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import { Spinner } from './spinner'
import type {
    ChangeEvent,
    ComponentPropsWithRef,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    Ref,
} from 'react'

export type SwitcherProps = Omit<ComponentPropsWithRef<'input'>, 'onChange'> & {
    checkedContent?: string | ReactNode
    toggledClass?: string
    isLoading?: boolean
    labelRef?: Ref<HTMLLabelElement>
    onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void
    unCheckedContent?: string | ReactNode
}

const Switcher = (props: SwitcherProps) => {
    const {
        checked,
        checkedContent,
        className,
        toggledClass,
        defaultChecked,
        disabled = false,
        isLoading = false,
        labelRef,
        onChange,
        onClick,
        onMouseDown,
        onKeyDown,
        readOnly,
        ref,
        unCheckedContent,
        'aria-label': ariaLabelProp,
        ...rest
    } = props
    const ariaLabelledByProp = props['aria-labelledby']
    const { classNames: configClassNames } = useConfig()
    const switcherClassNames = configClassNames?.switcher
    const effectiveDisabled = disabled || isLoading
    const [switcherChecked, setSwitcherChecked] = useState(
        checked ?? defaultChecked ?? false,
    )

    useEffect(() => {
        if (typeof checked === 'boolean') {
            setSwitcherChecked(checked)
        }
    }, [checked])

    const isChecked = checked ?? switcherChecked
    const stableContentLabel =
        typeof checkedContent === 'string'
            ? checkedContent
            : typeof unCheckedContent === 'string'
              ? unCheckedContent
              : undefined
    const accessibleName = ariaLabelProp ?? stableContentLabel

    const restoreReadOnlyState = useCallback(
        (input: HTMLInputElement) => {
            input.checked = isChecked
        },
        [isChecked],
    )

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (effectiveDisabled || readOnly) {
                restoreReadOnlyState(e.currentTarget)
                return
            }

            const nextChecked = e.currentTarget.checked
            if (typeof checked === 'undefined') {
                setSwitcherChecked(nextChecked)
            }
            onChange?.(nextChecked, e)
        },
        [checked, effectiveDisabled, onChange, readOnly, restoreReadOnlyState],
    )

    const handleClick = useCallback(
        (e: MouseEvent<HTMLInputElement>) => {
            onClick?.(e)
            if (readOnly) {
                e.preventDefault()
                const input = e.currentTarget
                restoreReadOnlyState(input)
                window.setTimeout(() => restoreReadOnlyState(input), 0)
            }
        },
        [onClick, readOnly, restoreReadOnlyState],
    )

    const handleMouseDown = useCallback(
        (e: MouseEvent<HTMLInputElement>) => {
            onMouseDown?.(e)
            if (readOnly) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [onMouseDown, readOnly, restoreReadOnlyState],
    )

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(e)
            if (
                !e.defaultPrevented &&
                readOnly &&
                (e.key === ' ' || e.key === 'Enter')
            ) {
                e.preventDefault()
                restoreReadOnlyState(e.currentTarget)
            }
        },
        [onKeyDown, readOnly, restoreReadOnlyState],
    )

    const switcherColor = toggledClass || 'bg-primary'

    return (
        <label
            ref={labelRef}
            className={classNames(
                'switcher group/switcher min-w-10 h-5 inline-flex items-center relative rounded-badge bg-input shadow-control cursor-pointer transition-colors ease-in-out duration-200 select-none',
                isChecked && `switcher-checked ${switcherColor}`,
                effectiveDisabled &&
                    'switcher-disabled opacity-50 cursor-not-allowed select-none',
                switcherClassNames?.root,
                className,
            )}
            data-disabled={effectiveDisabled ? '' : undefined}
            data-readonly={readOnly ? '' : undefined}
            data-state={isChecked ? 'checked' : 'unchecked'}
        >
            <input
                {...rest}
                ref={ref}
                type="checkbox"
                role="switch"
                checked={isChecked}
                disabled={effectiveDisabled}
                readOnly={readOnly}
                className={classNames(
                    'sr-only peer',
                    switcherClassNames?.control,
                )}
                aria-checked={isChecked}
                aria-label={ariaLabelledByProp ? undefined : accessibleName}
                aria-readonly={readOnly || undefined}
                aria-busy={isLoading || undefined}
                aria-disabled={effectiveDisabled || undefined}
                onChange={handleChange}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-badge peer-focus-visible:outline-2 peer-focus-visible:outline-solid peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            />
            {isLoading ? (
                <Spinner
                    size={16}
                    className={classNames(
                        'switcher-toggle-loading absolute transition-all ease-in-out duration-200 w-3 h-3 top-0.5',
                        isChecked
                            ? 'left-[calc(100%_-_1rem_-_0.125rem)]'
                            : 'left-0.5',
                        isChecked
                            ? 'switcher-checked-loading !text-primary-foreground'
                            : 'switcher-uncheck-loading text-muted-foreground',
                        switcherClassNames?.spinner,
                    )}
                />
            ) : (
                <div
                    aria-hidden="true"
                    className={classNames(
                        "switcher-toggle absolute transition-all ease-in-out duration-200 top-1/2 w-4 h-4 -translate-y-1/2 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:top-0 before:bg-primary-foreground before:rounded-badge",
                        isChecked
                            ? 'left-[calc(100%_-_1rem_-_0.125rem)]'
                            : 'left-0.5',
                        switcherClassNames?.thumb,
                    )}
                />
            )}
            <span
                aria-hidden={Boolean(ariaLabelledByProp || accessibleName)}
                className={classNames(
                    'switcher-content text-primary-foreground transition-colors ease-in-out duration-200',
                    isChecked
                        ? '[margin:0_1.65rem_0_0.45rem]'
                        : '[margin:0_0.45rem_0_1.65rem]',
                    switcherClassNames?.content,
                )}
            >
                {isChecked ? checkedContent : unCheckedContent}
            </span>
        </label>
    )
}

export default Switcher

export { Switcher }
