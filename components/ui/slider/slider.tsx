import { useCallback, useEffect, useRef, useState } from 'react'
import Thumb from './thumb'
import Track from './track'
import { useConfig } from '../config-provider/index'
import mergeClassNames from '@/utils/class-names'
import useMergeRef from '@/hooks/use-merge-ref'
import useControllableState from '@/hooks/use-controllable-state'
import { clamp } from './utils/clamp'
import getChangeValue from './utils/get-change-value'
import getFloatingValue from './utils/get-floating-value'
import getPosition from './utils/get-position'
import getPrecision from './utils/get-precision'
import getClosestNumber from './utils/get-closest-number'
import useMove from './utils/use-move'
import {
    getFirstMarkValue,
    getLastMarkValue,
    getNextMarkValue,
    getPreviousMarkValue,
} from './utils/get-step-mark-value'
import type {
    Ref,
    ReactNode,
    ComponentPropsWithoutRef,
    ComponentProps,
    KeyboardEvent,
} from 'react'

export type SliderVariant = 'default' | 'capsule'

export type SliderProps = Omit<ComponentProps<'div'>, 'value' | 'onChange'> & {
    alwaysShowTooltip?: boolean
    classNames?: {
        thumb?: string
        bar?: string
        mark?: string | ((isFilled: boolean) => string)
        track?: string
    }
    defaultValue?: number
    disabled?: boolean
    inputProps?: ComponentPropsWithoutRef<'input'>
    marks?: { value: number; label?: ReactNode }[]
    max?: number
    min?: number
    name?: string
    onChange?: (value: number) => void
    onDraggingStop?: (value: number) => void
    precision?: number
    ref?: Ref<HTMLDivElement>
    showTooltipOnHover?: boolean
    step?: number
    stepOnMarks?: boolean
    thumbAriaLabel?: string
    tooltip?: ReactNode | ((value: number) => ReactNode)
    variant?: SliderVariant
    value?: number
}

const Slider = (props: SliderProps) => {
    const {
        value,
        onChange,
        onDraggingStop,
        min = 0,
        max = 100,
        step = 1,
        precision: _precision,
        defaultValue = 0,
        name,
        marks = [],
        tooltip = (f) => f,
        variant: variantProp,
        alwaysShowTooltip = false,
        className,
        classNames = {},
        thumbAriaLabel,
        showTooltipOnHover = false,
        disabled = false,
        inputProps,
        stepOnMarks,
        ref = null,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults, direction } =
        useConfig()
    const sliderClassNames = configClassNames?.slider
    const variant = variantProp ?? componentDefaults?.slider?.variant ?? 'default'

    const [hovered, setHovered] = useState(false)
    const [_value, setValue] = useControllableState({
        prop: typeof value === 'number' ? clamp(value, min!, max!) : value,
        defaultProp:
            typeof defaultValue === 'number'
                ? clamp(defaultValue, min!, max!)
                : defaultValue,
        onChange,
    })

    const valueRef = useRef(_value)
    const root = useRef<HTMLDivElement>(null)
    const thumb = useRef<HTMLDivElement>(null)
    const position = getPosition({
        value: _value as number,
        min: min!,
        max: max!,
    })
    const positionRef = useRef(position)
    positionRef.current = position
    const [rawPosition, setRawPosition] = useState<number | null>(null)
    const [settling, setSettling] = useState(false)
    const settlingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const scaledValue = _value as number
    const _tooltip =
        typeof tooltip === 'function' ? tooltip(scaledValue) : tooltip
    const precision = _precision ?? getPrecision(step!)
    const edgePadding = variant === 'capsule' ? 12 : 0

    const clearSettlingTimer = useCallback(() => {
        if (settlingTimer.current !== null) {
            clearTimeout(settlingTimer.current)
            settlingTimer.current = null
        }
    }, [])

    useEffect(
        () => () => {
            clearSettlingTimer()
        },
        [clearSettlingTimer],
    )

    const handleChange = useCallback(
        ({ x }: { x: number }) => {
            if (!disabled) {
                setRawPosition(x * 100)

                const nextValue = getChangeValue({
                    value: x,
                    min: min!,
                    max: max!,
                    step: step!,
                    precision,
                })
                setValue(
                    stepOnMarks && marks?.length
                        ? getClosestNumber(
                              nextValue,
                              marks.map((mark) => mark.value),
                          )
                        : nextValue,
                )
                valueRef.current = nextValue
            }
        },
        [
            disabled,
            min,
            max,
            step,
            precision,
            setValue,
            marks,
            stepOnMarks,
            variant,
        ],
    )

    const { ref: container, active } = useMove(
        handleChange,
        {
            onScrubStart: () => {
                clearSettlingTimer()
                setSettling(false)
                setRawPosition(positionRef.current)
            },
            onScrubStop: () => {
                if (disabled) {
                    return
                }

                clearSettlingTimer()
                setSettling(true)
                settlingTimer.current = setTimeout(
                    () => setSettling(false),
                    150,
                )
            },
            onScrubEnd: () =>
                !disabled &&
                onDraggingStop?.(
                    (stepOnMarks && marks?.length
                        ? getClosestNumber(
                              valueRef.current as number,
                              marks.map((mark) => mark.value),
                          )
                        : valueRef.current) as number,
                ),
        },
        direction,
        edgePadding,
    )

    const renderedPosition =
        active && !disabled && rawPosition !== null
            ? rawPosition
            : position
    const isSettling = !active && settling

    const handleTrackKeydownCapture = (
        event: KeyboardEvent<HTMLDivElement>,
    ) => {
        if (!disabled) {
            switch (event.key) {
                case 'ArrowUp': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        const nextValue = getNextMarkValue(
                            _value as number,
                            marks,
                        )
                        setValue(nextValue)
                        onDraggingStop?.(nextValue)
                        break
                    }

                    const nextValue = getFloatingValue(
                        Math.min(
                            Math.max((_value as number) + step!, min!),
                            max!,
                        ),
                        precision,
                    )
                    setValue(nextValue)
                    onDraggingStop?.(nextValue)
                    break
                }

                case 'ArrowRight': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        const nextValue =
                            direction === 'rtl'
                                ? getPreviousMarkValue(_value as number, marks)
                                : getNextMarkValue(_value as number, marks)
                        setValue(nextValue)
                        onDraggingStop?.(nextValue)
                        break
                    }

                    const nextValue = getFloatingValue(
                        Math.min(
                            Math.max(
                                direction === 'rtl'
                                    ? (_value as number) - step!
                                    : (_value as number) + step!,
                                min!,
                            ),
                            max!,
                        ),
                        precision,
                    )
                    setValue(nextValue)
                    onDraggingStop?.(nextValue)
                    break
                }

                case 'ArrowDown': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        const nextValue = getPreviousMarkValue(
                            _value as number,
                            marks,
                        )
                        setValue(nextValue)
                        onDraggingStop?.(nextValue)
                        break
                    }

                    const nextValue = getFloatingValue(
                        Math.min(
                            Math.max((_value as number) - step!, min!),
                            max!,
                        ),
                        precision,
                    )
                    setValue(nextValue)
                    onDraggingStop?.(nextValue)
                    break
                }

                case 'ArrowLeft': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        const nextValue =
                            direction === 'rtl'
                                ? getNextMarkValue(_value as number, marks)
                                : getPreviousMarkValue(_value as number, marks)
                        setValue(nextValue)
                        onDraggingStop?.(nextValue)
                        break
                    }

                    const nextValue = getFloatingValue(
                        Math.min(
                            Math.max(
                                direction === 'rtl'
                                    ? (_value as number) + step!
                                    : (_value as number) - step!,
                                min!,
                            ),
                            max!,
                        ),
                        precision,
                    )
                    setValue(nextValue)
                    onDraggingStop?.(nextValue)
                    break
                }

                case 'Home': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        setValue(getFirstMarkValue(marks))
                        onDraggingStop?.(getFirstMarkValue(marks))
                        break
                    }

                    setValue(min!)
                    onDraggingStop?.(min!)
                    break
                }

                case 'End': {
                    event.preventDefault()
                    thumb.current?.focus()

                    if (stepOnMarks && marks) {
                        setValue(getLastMarkValue(marks))
                        onDraggingStop?.(getLastMarkValue(marks))
                        break
                    }

                    setValue(max!)
                    onDraggingStop?.(max!)
                    break
                }

                default: {
                    break
                }
            }
        }
    }

    return (
        <div
            {...rest}
            ref={useMergeRef(ref, root)}
            className={mergeClassNames(sliderClassNames?.root, className)}
            data-disabled={disabled ? '' : undefined}
            data-variant={variant}
            onKeyDownCapture={handleTrackKeydownCapture}
            onMouseDownCapture={() => root.current?.focus()}
        >
            <Track
                offset={0}
                filled={renderedPosition}
                marks={marks}
                min={min!}
                max={max!}
                value={scaledValue}
                variant={variant}
                disabled={disabled}
                settling={isSettling}
                trackWrapperClass={sliderClassNames?.trackWrapper}
                trackClass={mergeClassNames(
                    sliderClassNames?.track,
                    classNames.track,
                )}
                barClass={mergeClassNames(
                    sliderClassNames?.range,
                    classNames.bar,
                )}
                markClass={(isFilled) =>
                    mergeClassNames(
                        sliderClassNames?.mark,
                        typeof classNames.mark === 'function'
                            ? classNames.mark(isFilled)
                            : classNames.mark,
                    )
                }
                markLabelClass={sliderClassNames?.markLabel}
                direction={direction}
                containerProps={{
                    ref: container,
                    onMouseEnter: showTooltipOnHover
                        ? () => setHovered(true)
                        : undefined,
                    onMouseLeave: showTooltipOnHover
                        ? () => setHovered(false)
                        : undefined,
                }}
            >
                <Thumb
                    ref={thumb}
                    max={max!}
                    min={min!}
                    value={scaledValue}
                    position={renderedPosition}
                    variant={variant}
                    direction={direction}
                    dragging={active}
                    settling={isSettling}
                    tooltip={_tooltip}
                    alwaysShowTooltip={alwaysShowTooltip}
                    thumbAriaLabel={thumbAriaLabel}
                    showTooltipOnHover={showTooltipOnHover}
                    isHovered={hovered}
                    disabled={disabled}
                    thumbClass={mergeClassNames(
                        sliderClassNames?.thumb,
                        classNames.thumb,
                    )}
                    tooltipClass={sliderClassNames?.tooltip}
                />
            </Track>

            <input
                type="hidden"
                name={name}
                value={scaledValue}
                {...inputProps}
            />
        </div>
    )
}

export default Slider
