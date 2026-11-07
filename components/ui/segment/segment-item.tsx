import { useCallback } from 'react'
import classNames from '@/utils/class-names'
import { useConfig, SIZES } from '../config-provider/index'
import { useSegment } from './context'
import type { TypeAttributes } from '../config-provider/types'
import type { ReactNode, ComponentPropsWithRef } from 'react'

const SEGMENT_SIZES = {
    sm: { h: 'h-6', w: 'w-10', minH: 'min-h-7', minW: 'min-w-10' },
    md: { h: 'h-7', w: 'w-10', minH: 'min-h-7', minW: 'min-w-10' },
    lg: { h: 'h-9', w: 'w-12', minH: 'min-h-9', minW: 'min-w-12' },
}

type ChildrenParams = {
    active: boolean
    disabled: boolean
    value: string
    onSegmentItemClick: () => void
}

export type SegmentItemProps =
    Omit<ComponentPropsWithRef<'button'>, 'children'> & {
    children: ((params: ChildrenParams) => ReactNode) | ReactNode
    disabled?: boolean
    size?: TypeAttributes.ControlSize
    value?: string
}

const unwrapArray = (arg: (params: ChildrenParams) => ReactNode) =>
    Array.isArray(arg) ? arg[0] : arg

const SegmentItem = (props: SegmentItemProps) => {
    const {
        children,
        className,
        disabled = false,
        ref,
        value: valueProp,
        size: itemSizeProp,
        ...rest
    } = props

    const {
        value: valueContext,
        onActive,
        onDeactivate,
        selectionType,
        size: segmentSize,
    } = useSegment()
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const segmentClassNames = configClassNames?.segment

    const active =
        selectionType === 'single'
            ? valueContext === valueProp
            : (valueContext as unknown as string[]).includes(
                  valueProp as string,
              )

    const buttonSize =
        itemSizeProp ?? segmentSize ?? componentDefaults?.segment?.size ?? 'md'

    const getSegmentSize = useCallback(() => {
        let sizeClass = ''
        switch (buttonSize) {
            case SIZES.LG:
                sizeClass = classNames(SEGMENT_SIZES.lg.h, 'md:px-6')
                break
            case SIZES.SM:
                sizeClass = classNames(SEGMENT_SIZES.sm.h, 'text-sm')
                break
            default:
                sizeClass = classNames(SEGMENT_SIZES.md.h, '')
                break
        }
        return sizeClass
    }, [buttonSize])

    const onSegmentItemClick = () => {
        if (!disabled) {
            if (!active) {
                if (selectionType === 'single') {
                    onActive?.(valueProp as string)
                }
                if (selectionType === 'multiple') {
                    const nextValue = [
                        ...(valueContext as unknown as string[]),
                        ...[valueProp],
                    ] as string[]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onActive?.(nextValue as any)
                }
            } else if (selectionType === 'multiple') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onDeactivate?.(valueProp as any)
            }
        }
    }

    return typeof children === 'function' ? (
        unwrapArray(children)({
            active,
            onSegmentItemClick,
            disabled,
            value: valueProp,
            ...rest,
        })
    ) : (
        <button
            ref={ref}
            className={classNames(
                'segment-item font-semibold outline-none cursor-pointer select-none rounded-control-sm px-5 md:w-auto text-center transition-all duration-100 ease-in-out flex items-center justify-center',
                getSegmentSize(),
                !active &&
                    !disabled &&
                    'hover:text-accent-foreground',
                active && 'segment-item-active text-foreground',
                selectionType === 'multiple' &&
                    active &&
                    'segment-item-multiple-selectable bg-card shadow-sm',
                disabled && 'segment-item-disabled cursor-not-allowed opacity-40',
                segmentClassNames?.item,
                className,
            )}
            data-state={active ? 'on' : 'off'}
            data-disabled={disabled ? '' : undefined}
            onClick={onSegmentItemClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    )
}

export default SegmentItem
