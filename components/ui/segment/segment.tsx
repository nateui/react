import { Children, isValidElement, useMemo } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { SegmentContextProvider } from './context'
import useControllableState from '@/hooks/use-controllable-state'
import type { TypeAttributes } from '../config-provider/types'
import type { SegmentValue } from './context'
import type { Ref, ComponentProps } from 'react'

export type SegmentProps<
    T extends 'single' | 'multiple' = 'single',
> = Omit<ComponentProps<'div'>, 'onChange'> & {
    defaultValue?: SegmentValue<T>
    onChange?: (segmentValue: SegmentValue<T>) => void
    ref?: Ref<HTMLDivElement>
    selectionType?: 'single' | 'multiple'
    size?: TypeAttributes.ControlSize
    value?: SegmentValue<T>
}

const Segment = <T extends 'single' | 'multiple' = 'single'>(
    props: SegmentProps<T>,
) => {
    const {
        children,
        className,
        defaultValue,
        onChange = () => {
            // empty callback
        },
        ref,
        selectionType = 'single',
        size: sizeProp,
        value: valueProp,
        ...rest
    } = props

    const [value, setValue] = useControllableState<SegmentValue<T>>({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onChange,
    })
    const { classNames: configClassNames, componentDefaults, direction } =
        useConfig()
    const segmentClassNames = configClassNames?.segment

    const onActive = (itemValue: SegmentValue<T>) => {
        setValue(itemValue)
    }

    const onDeactivate = (itemValue: SegmentValue<T>) => {
        if (selectionType === 'single') {
            setValue('' as SegmentValue<T>)
        }

        if (selectionType === 'multiple') {
            setValue((prevValue) => {
                return (prevValue as string[]).filter(
                    (value) => value !== itemValue,
                ) as SegmentValue<T>
            })
        }
    }

    const segmentValue = useMemo(() => {
        if (selectionType === 'single') {
            return value
        }

        if (selectionType === 'multiple') {
            return value ? value : []
        }
    }, [selectionType, value])

    const childArray = Children.toArray(children)
    const activeIndex = childArray.findIndex((child) => {
        if (!isValidElement<{ value?: string }>(child)) {
            return false
        }
        return child.props.value === segmentValue
    })
    const indicatorStyle =
        selectionType === 'single' && activeIndex >= 0 && childArray.length > 0
            ? {
                  display: 'block',
                  width: `${100 / childArray.length}%`,
                  transform: `translateX(${
                      direction === 'rtl' ? -activeIndex * 100 : activeIndex * 100
                  }%)`,
              }
            : undefined

    return (
        <SegmentContextProvider
            value={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: segmentValue as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onActive: onActive as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onDeactivate: onDeactivate as any,
                selectionType,
                size: sizeProp ?? componentDefaults?.segment?.size,
            }}
        >
            <div
                ref={ref}
                className={classNames(
                    'segment inline-grid align-top grid-flow-col auto-cols-[1fr] items-stretch rounded-control p-1 relative min-w-max isolate',
                    'gap-2 bg-muted shadow-control',
                    segmentClassNames?.root,
                    className,
                )}
                {...rest}
            >
                {children}
                {selectionType === 'single' && (
                    <div
                        className={classNames(
                            "segment-item-indicator hidden absolute z-[-1] h-full pointer-events-none transition-transform ease-in-out duration-100 ltr:left-0 rtl:right-0 top-0 before:absolute before:rounded-control-sm before:bg-card before:content-[''] before:inset-1 before:shadow-sm",
                            segmentClassNames?.indicator,
                        )}
                        style={indicatorStyle}
                    />
                )}
            </div>
        </SegmentContextProvider>
    )
}

export default Segment
