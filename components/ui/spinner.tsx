import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { ElementType, ComponentProps, Ref } from 'react'

export type SpinnerProps = ComponentProps<ElementType> & {
    enableTheme?: boolean
    indicator?: ElementType
    isSpining?: boolean
    size?: string | number
    trackClassName?: string
    indicatorClassName?: string
    ref?: Ref<HTMLElement>
}

const DefaultIcon = ({
    height,
    width,
    trackClassName,
    indicatorClassName,
    ...rest
}: SpinnerProps) => (
    <svg
        height={height}
        width={width}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        aria-labelledby=":r1:"
        {...rest}
    >
        <circle
            cx="8"
            cy="8"
            r="7"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className={trackClassName}
        ></circle>
        <path
            d="M15 8a7.002 7.002 0 00-7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={indicatorClassName}
        ></path>
    </svg>
)

const Spinner = (props: SpinnerProps) => {
    const {
        className,
        enableTheme = true,
        indicator: Component = DefaultIcon,
        isSpining = true,
        size: sizeProp,
        style,
        ref,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const spinnerClassNames = configClassNames?.spinner
    const size = sizeProp ?? componentDefaults?.spinner?.size ?? 20

    const spinnerStyle = {
        height: size,
        width: size,
        ...style,
    }

    const spinnerClass = classNames(
        'spinner',
        enableTheme && 'spinner-default-theme text-primary',
        isSpining && 'animate-spin',
        spinnerClassNames?.root,
        className,
    )
    const defaultIndicatorSlotProps =
        Component === DefaultIcon
            ? {
                  trackClassName: spinnerClassNames?.track,
                  indicatorClassName: spinnerClassNames?.indicator,
              }
            : {}

    return (
        <Component
            ref={ref}
            style={spinnerStyle}
            className={spinnerClass}
            height={size}
            width={size}
            role="status"
            {...defaultIndicatorSlotProps}
            {...rest}
        />
    )
}

export default Spinner

export { Spinner }
