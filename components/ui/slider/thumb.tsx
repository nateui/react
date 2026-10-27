import { useState } from 'react'
import classNames from '@/utils/class-names'
import type { SliderVariant } from './slider'
import type { TypeAttributes } from '../config-provider/types'
import type {
    Ref,
    ComponentProps,
    ReactNode,
    KeyboardEvent,
    CSSProperties,
} from 'react'

export interface ThumbProps extends Omit<ComponentProps<'div'>, 'value'> {
    max: number
    min: number
    value: number
    position: number
    variant: SliderVariant
    dragging: boolean
    settling: boolean
    direction: TypeAttributes.Direction
    tooltip: ReactNode
    onKeyDownCapture?: (event: KeyboardEvent<HTMLDivElement>) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseDown?: (event: any) => void
    alwaysShowTooltip: boolean | undefined
    thumbAriaLabel: string | undefined
    showTooltipOnHover: boolean | undefined
    isHovered?: boolean
    children?: ReactNode
    disabled: boolean | undefined
    thumbClass?: string
    tooltipClass?: string
    style?: CSSProperties
    ref: Ref<HTMLDivElement>
}

const Thumb = ({
    max,
    min,
    value,
    position,
    variant,
    tooltip,
    direction,
    dragging,
    settling,
    onMouseDown,
    onKeyDownCapture,
    alwaysShowTooltip,
    thumbAriaLabel,
    onFocus,
    onBlur,
    showTooltipOnHover,
    isHovered,
    children = null,
    disabled,
    thumbClass,
    tooltipClass,
    ref,
}: ThumbProps) => {
    const [focused, setFocused] = useState(false)

    const isVisible =
        alwaysShowTooltip ||
        (showTooltipOnHover && (isHovered || dragging || focused))


    return (
        <div
            className={classNames(
                variant === 'capsule'
                    ? 'slider-thumb-wrapper absolute top-1/2 -translate-y-1/2 z-[3]'
                    : 'slider-thumb-wrapper absolute',
                variant === 'capsule' &&
                    (direction === 'rtl'
                        ? 'translate-x-1/2'
                        : '-translate-x-1/2'),
                settling &&
                    !dragging &&
                    'transition-[left,right] duration-150 ease-out motion-reduce:transition-none',
            )}
            style={
                direction === 'rtl'
                    ? { right: `${position}%` }
                    : { left: `${position}%` }
            }
        >
            <div
                ref={ref}
                tabIndex={0}
                role="slider"
                aria-label={thumbAriaLabel}
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value}
                className={classNames(
                    variant === 'capsule'
                        ? "slider-thumb relative flex h-5 w-7 shrink-0 cursor-grab items-center justify-center rounded-full bg-primary z-[3] select-none touch-none outline-offset-2 before:pointer-events-none before:absolute before:inset-[2px] before:rounded-full before:bg-primary-foreground before:content-[''] before:transition-transform before:duration-150 before:ease-out motion-reduce:before:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
                        : 'slider-thumb absolute flex rounded-full h-4.5 w-4.5 -translate-x-2/4 -translate-y-2/4 cursor-pointer items-center justify-center z-[3] select-none touch-none outline-offset-2 left-0 border-3 border-solid top-[2.25px] border-primary bg-card transition duration-150 ease',
                    'shadow-control',
                    disabled && 'disabled cursor-not-allowed border-control-disabled',
                    variant === 'capsule' &&
                        disabled &&
                        'bg-control-disabled before:bg-control-disabled-foreground',
                    dragging && 'dragging',
                    dragging &&
                        !disabled &&
                        variant === 'capsule' &&
                        'cursor-grabbing before:scale-90 motion-reduce:before:scale-100',
                    dragging && !disabled && variant === 'default' && 'shadow-lg h-5 w-5',
                    thumbClass,
                )}
                data-disabled={disabled ? '' : undefined}
                data-dragging={dragging ? '' : undefined}
                onFocus={(event) => {
                    setFocused(true)
                    if (typeof onFocus === 'function') {
                        onFocus(event)
                    }
                }}
                onBlur={(event) => {
                    setFocused(false)
                    if (typeof onBlur === 'function') {
                        onBlur(event)
                    }
                }}
                onTouchStart={onMouseDown}
                onMouseDown={onMouseDown}
                onKeyDownCapture={onKeyDownCapture}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
            {isVisible && (
                <div
                    className={classNames(
                        'slider-tooltip absolute text-xs whitespace-nowrap pointer-events-none select-none touch-none z-tooltip max-w-[250px] text-inverse-foreground rounded-control-sm p-2 -top-11 left-0 rtl:-translate-x-1/4 bg-inverse -translate-x-2/4 shadow-popover',
                        tooltipClass,
                    )}
                >
                    {tooltip}
                </div>
            )}
        </div>
    )
}

export default Thumb
