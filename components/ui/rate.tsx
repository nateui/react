'use client'

import type {
    ComponentPropsWithRef,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    SVGProps,
} from 'react'
import { useConfig } from './config-provider/index'
import useControllableState from '@/hooks/use-controllable-state'
import classNames from '@/utils/class-names'
import type { TypeAttributes } from './config-provider/types'

type RateCharacter =
    | ReactNode
    | ((props: { index: number; value: number; active: boolean }) => ReactNode)

export type RateProps = Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'onChange'
> & {
    value?: number
    defaultValue?: number
    count?: number
    allowHalf?: boolean
    allowClear?: boolean
    disabled?: boolean
    readOnly?: boolean
    name?: string
    character?: RateCharacter
    tooltips?: string[]
    label?: ReactNode
    size?: TypeAttributes.ControlSize
    classNames?: {
        item?: string
        icon?: string
        label?: string
    }
    onChange?: (value: number) => void
    onHoverChange?: (value: number) => void
}

const CONTROL_SIZE_CLASSES = {
    sm: 'gap-0.5 text-base',
    md: 'gap-1 text-xl',
    lg: 'gap-1.5 text-2xl',
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

const StarIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.691h4.16c.969 0 1.371 1.24.588 1.809l-3.366 2.445a1 1 0 0 0-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 0 0-1.176 0l-3.366 2.445c-.783.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 0 0-.364-1.118L2.063 9.384c-.783-.569-.38-1.809.588-1.809h4.16a1 1 0 0 0 .95-.691z" />
    </svg>
)

const Rate = (props: RateProps) => {
    const {
        ref,
        value,
        defaultValue = 0,
        count = 5,
        allowHalf = false,
        allowClear = true,
        disabled = false,
        readOnly = false,
        name,
        character,
        tooltips,
        label,
        size,
        className,
        classNames: rateClassNames,
        'aria-label': ariaLabel,
        'aria-valuetext': ariaValueText,
        onChange,
        onHoverChange,
        onKeyDown,
        onMouseLeave,
        ...rest
    } = props

    const { direction, classNames: configClassNames, componentDefaults } =
        useConfig()
    const rateSize = size ?? componentDefaults?.rate?.size ?? 'md'
    const itemCount = Math.max(1, Math.floor(count))
    const step = allowHalf ? 0.5 : 1

    const [innerValue, setInnerValue] = useControllableState({
        prop: value,
        defaultProp: defaultValue,
        onChange,
    })
    const [hoverValue, setHoverValue] = useControllableState<number>({
        defaultProp: 0,
        onChange: onHoverChange,
    })

    const normalizeValue = (nextValue: number) =>
        clamp(Math.round(nextValue / step) * step, 0, itemCount)

    const currentValue = normalizeValue(innerValue ?? 0)
    const currentHoverValue = normalizeValue(hoverValue ?? 0)
    const displayValue = currentHoverValue > 0 ? currentHoverValue : currentValue
    const interactive = !disabled && !readOnly

    const setRateValue = (nextValue: number) => {
        if (!interactive) {
            return
        }

        const normalizedValue = normalizeValue(nextValue)
        const finalValue =
            allowClear && normalizedValue === currentValue ? 0 : normalizedValue

        setInnerValue(finalValue)
    }

    const handleMouseMove = (
        event: MouseEvent<HTMLButtonElement>,
        index: number,
    ) => {
        if (!interactive) {
            return
        }

        const itemValue = index + 1
        let nextValue = itemValue

        if (allowHalf) {
            const rect = event.currentTarget.getBoundingClientRect()
            const isFirstHalf = event.clientX - rect.left <= rect.width / 2

            nextValue =
                direction === 'rtl'
                    ? isFirstHalf
                        ? itemValue
                        : itemValue - 0.5
                    : isFirstHalf
                      ? itemValue - 0.5
                      : itemValue
        }

        setHoverValue(normalizeValue(nextValue))
    }

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
        setHoverValue(0)
        onMouseLeave?.(event)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) {
            onKeyDown?.(event)
            return
        }

        const isRtl = direction === 'rtl'
        let nextValue: number | undefined

        switch (event.key) {
            case 'ArrowRight':
                nextValue = currentValue + (isRtl ? -step : step)
                break
            case 'ArrowLeft':
                nextValue = currentValue + (isRtl ? step : -step)
                break
            case 'ArrowUp':
                nextValue = currentValue + step
                break
            case 'ArrowDown':
                nextValue = currentValue - step
                break
            case 'Home':
                nextValue = 0
                break
            case 'End':
                nextValue = itemCount
                break
            default:
                onKeyDown?.(event)
                return
        }

        event.preventDefault()
        setInnerValue(normalizeValue(nextValue))
        onKeyDown?.(event)
    }

    const renderCharacter = (index: number, active: boolean) => {
        if (typeof character === 'function') {
            return character({
                index,
                value: index + 1,
                active,
            })
        }

        return character ?? <StarIcon className="h-[1em] w-[1em] shrink-0" />
    }

    const getFillWidth = (index: number) => {
        const valueOffset = displayValue - index

        if (valueOffset >= 1) {
            return '100%'
        }

        if (valueOffset > 0) {
            return '50%'
        }

        return '0%'
    }

    return (
        <div
            {...rest}
            ref={ref}
            role="slider"
            aria-label={ariaLabel ?? 'Rate'}
            aria-valuemin={0}
            aria-valuemax={itemCount}
            aria-valuenow={currentValue}
            aria-valuetext={ariaValueText ?? `${currentValue} of ${itemCount}`}
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            tabIndex={disabled ? -1 : rest.tabIndex ?? 0}
            dir={direction}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            className={classNames(
                'rate inline-flex items-center align-middle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                CONTROL_SIZE_CLASSES[rateSize],
                disabled && 'opacity-50',
                configClassNames?.rate?.root,
                className,
            )}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
        >
            {name ? (
                <input type="hidden" name={name} value={currentValue} />
            ) : null}
            {Array.from({ length: itemCount }, (_, index) => {
                const itemValue = index + 1
                const fillWidth = getFillWidth(index)
                const active = fillWidth !== '0%'
                const tooltip = tooltips?.[index]

                return (
                    <button
                        key={index}
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        title={tooltip}
                        disabled={disabled || readOnly}
                        data-value={itemValue}
                        data-active={active || undefined}
                        className={classNames(
                            'rate-item relative inline-flex shrink-0 items-center justify-center rounded-control-sm text-muted-foreground/35 transition-transform duration-150',
                            interactive && 'cursor-pointer hover:scale-105',
                            readOnly && 'cursor-default',
                            configClassNames?.rate?.item,
                            rateClassNames?.item,
                        )}
                        onMouseMove={(event) => handleMouseMove(event, index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            setRateValue(currentHoverValue || itemValue)
                        }
                    >
                        <span
                            className={classNames(
                                'rate-icon inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center',
                                configClassNames?.rate?.icon,
                                rateClassNames?.icon,
                            )}
                        >
                            {renderCharacter(index, active)}
                        </span>
                        <span
                            className={classNames(
                                'rate-icon-filled pointer-events-none absolute top-0 bottom-0 inline-flex items-center overflow-hidden text-palette-yellow',
                                direction === 'rtl'
                                    ? 'right-0 justify-end'
                                    : 'left-0 justify-start',
                            )}
                            style={{ width: fillWidth }}
                        >
                            <span
                                className={classNames(
                                    'rate-icon inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center',
                                    configClassNames?.rate?.icon,
                                    rateClassNames?.icon,
                                )}
                            >
                                {renderCharacter(index, active)}
                            </span>
                        </span>
                    </button>
                )
            })}
            {label ? (
                <span
                    className={classNames(
                        'rate-label ms-2 text-sm text-muted-foreground',
                        configClassNames?.rate?.label,
                        rateClassNames?.label,
                    )}
                >
                    {label}
                </span>
            ) : null}
        </div>
    )
}

export default Rate
