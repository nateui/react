import Marks from './marks'
import type { SliderVariant } from './slider'
import classNames from '@/utils/class-names'
import type { TypeAttributes } from '../config-provider/types'
import type { ComponentProps, ReactNode } from 'react'

export interface TrackProps {
    filled: number
    offset?: number
    marksOffset?: number
    marks?: { value: number; label?: ReactNode }[]
    min: number
    max: number
    value: number
    variant: SliderVariant
    children: ReactNode
    disabled?: boolean
    isRange?: boolean
    settling?: boolean
    containerProps?: ComponentProps<'div'>
    trackWrapperClass?: string
    trackClass?: string
    barClass?: string
    markClass?: string | ((isFilled: boolean) => string)
    markLabelClass?: string
    direction: TypeAttributes.Direction
}

export function Track({
    filled,
    variant,
    children,
    offset,
    disabled,
    isRange = false,
    settling = false,
    marksOffset,
    containerProps,
    trackWrapperClass,
    trackClass,
    barClass,
    markClass,
    markLabelClass,
    ...rest
}: TrackProps) {
    return (
        <div
            className={classNames(
                variant === 'capsule'
                    ? 'slider-track-wrapper flex items-center w-full cursor-pointer h-11 py-3'
                    : 'slider-track-wrapper flex items-center w-full cursor-pointer h-1 py-2.5',
                trackWrapperClass,
            )}
            {...containerProps}
            data-disabled={disabled ? '' : undefined}
        >
            <div
                className={classNames(
                    variant === 'capsule'
                        ? "slider-track h-5 relative w-full border-x-[0.75rem] border-x-transparent before:content-[''] before:bg-muted before:absolute before:top-0 before:bottom-0 before:rounded-full before:-inset-x-[0.75rem] before:z-0"
                        : "slider-track h-1 relative w-full before:content-[''] before:bg-muted before:absolute before:top-0 before:bottom-0 before:rounded-full before:inset-x-0 before:z-0",
                    trackClass,
                )}
                data-disabled={disabled ? '' : undefined}
            >
                <div
                    className={classNames(
                        variant === 'capsule'
                            ? 'slider-bar absolute z-[1] bg-primary rounded-full inset-y-0'
                            : 'slider-bar absolute z-[1] bg-primary rounded-sm inset-y-0',
                        settling &&
                            'transition-[width,inset-inline-start] duration-150 ease-out motion-reduce:transition-none',
                        disabled &&
                            'disabled bg-control-disabled cursor-not-allowed',
                        barClass,
                    )}
                    style={{
                        ...(variant === 'capsule'
                            ? {
                                  width: isRange
                                      ? `${filled}%`
                                      : `calc(${filled}% + 0.75rem)`,
                                  insetInlineStart: isRange
                                      ? `${offset ?? 0}%`
                                      : '-0.75rem',
                              }
                            : {
                                  width: `calc(${filled}% + 6px)`,
                                  ...(offset && {
                                      insetInlineStart: `calc(${offset}% - 6px)`,
                                  }),
                              }),
                        // insetInlineStart: `calc(${offset}% - 6px)`,
                    }}
                />

                {children}
                <Marks
                    {...rest}
                    markClass={markClass}
                    markLabelClass={markLabelClass}
                    offset={marksOffset}
                    variant={variant}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}
export default Track
