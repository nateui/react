import getPosition from './utils/get-position'
import classNames from '@/utils/class-names'
import type { SliderVariant } from './slider'
import type { TypeAttributes } from '../config-provider/types'
import type { ReactNode } from 'react'

function isMarkFilled({
    mark,
    offset,
    value,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mark: { value: number; label?: any }
    offset?: number
    value: number
    inverted?: boolean
}) {
    return typeof offset === 'number'
        ? mark.value >= offset && mark.value <= value
        : mark.value <= value
}

export interface MarksProps {
    marks?: { value: number; label?: ReactNode }[]
    min: number
    max: number
    value: number
    offset?: number
    variant: SliderVariant
    disabled?: boolean
    markClass?: string | ((isFilled: boolean) => string)
    markLabelClass?: string
    direction: TypeAttributes.Direction
}

function Marks({
    marks,
    min,
    max,
    disabled,
    value,
    offset,
    direction,
    variant,
    markClass,
    markLabelClass,
}: MarksProps) {
    if (!marks) {
        return null
    }

    const items = marks.map((mark, index) => (
        <div
            key={index}
            className={classNames(
                'slider-mark-wrapper absolute z-[2] pointer-events-none flex flex-col items-center ltr:-translate-x-[50%] rtl:translate-x-[50%]',
                variant === 'capsule'
                    ? 'top-2 gap-2'
                    : '-top-[3px] gap-1',
            )}
            style={
                variant === 'capsule'
                    ? {
                          insetInlineStart: `${getPosition({ value: mark.value, min, max })}%`,
                      }
                    : direction === 'rtl'
                      ? {
                            insetInlineStart: `calc(${getPosition({ value: mark.value, min, max })}% - 6px )`,
                        }
                      : {
                            insetInlineStart: `calc(${getPosition({ value: mark.value, min, max })}% - 6px / 2)`,
                        }
            }
        >
            <div
                className={classNames(
                    variant === 'capsule'
                        ? 'slider-mark h-1 w-1 bg-muted-foreground pointer-events-none rounded-full'
                        : 'slider-mark h-2.5 w-2.5 bg-card pointer-events-none rounded-full border-3',
                    isMarkFilled({ mark, offset, value }) &&
                        (variant === 'capsule'
                            ? 'slider-mark-filled bg-primary-foreground'
                            : 'slider-mark-filled border-primary'),
                    disabled &&
                        (variant === 'capsule'
                            ? 'disabled bg-control-disabled-foreground'
                            : 'disabled'),
                    typeof markClass === 'function'
                        ? markClass(
                              isMarkFilled({
                                  mark,
                                  offset,
                                  value,
                              }),
                          )
                        : markClass,
                )}
            />
            {mark.label && (
                <div
                    className={classNames(
                        'slider-mark-label whitespace-nowrap cursor-pointer select-none',
                        markLabelClass,
                    )}
                >
                    {mark.label}
                </div>
            )}
        </div>
    ))

    return <div>{items}</div>
}

export default Marks
