import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import Line from './line'
import Circle from './circle'
import type { StrokeLinecap, GapPosition } from './circle'
import type { ReactNode, Ref, ComponentProps } from 'react'

const DIRECTIONS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
}

export type ProgressProps = ComponentProps<'div'> & {
    customInfo?: string | ReactNode
    strokeClass?: string
    gapDegree?: number
    gapPosition?: GapPosition
    percent?: number
    ref?: Ref<HTMLDivElement>
    showInfo?: boolean
    size?: 'sm' | 'md'
    strokeLinecap?: StrokeLinecap
    strokeWidth?: number
    trailClass?: string
    width?: string | number
    variant?: 'line' | 'circle'
}

const Progress = (props: ProgressProps) => {
    const {
        className,
        customInfo,
        strokeClass,
        gapDegree = 0,
        gapPosition = DIRECTIONS.TOP,
        percent = 0,
        ref,
        showInfo = true,
        size: sizeProp,
        strokeLinecap = 'round',
        strokeWidth = 6,
        width = 120,
        variant = 'line',
    } = props
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const progressClassNames = configClassNames?.progress
    const size = sizeProp ?? componentDefaults?.progress?.size ?? 'md'

    const renderProcessInfo = () => {
        if (!showInfo) {
            return null
        }
        return (
            <span
                className={classNames(
                    `progress-info ${variant}`,
                    variant === 'line' && 'ltr:ml-2 rtl:mr-2',
                    progressClassNames?.info,
                )}
            >
                {customInfo || `${percent}%`}
            </span>
        )
    }

    const strokeColor = strokeClass
        ? strokeClass
        : variant === 'line'
          ? 'bg-primary'
          : 'text-primary'

    const progressClass = classNames(
        'progress inline-block',
        variant === 'circle' ? 'circle relative w-full' : 'line relative w-full flex items-center',
        progressClassNames?.root,
        className,
    )

    const renderProgress = () => {
        const progressInfo = renderProcessInfo()
        let progress

        if (variant === 'line') {
            progress = (
                <Line
                    percent={percent}
                    size={size}
                    strokeColor={strokeColor}
                    {...props}
                >
                    {progressInfo}
                </Line>
            )
        }

        if (variant === 'circle') {
            progress = (
                <Circle
                    gapDegree={gapDegree}
                    gapPosition={gapPosition as GapPosition}
                    percent={percent}
                    strokeColor={strokeColor}
                    strokeLinecap={strokeLinecap}
                    strokeWidth={strokeWidth}
                    width={width}
                    {...props}
                >
                    {progressInfo}
                </Circle>
            )
        }

        return progress
    }

    return (
        <div ref={ref} className={progressClass}>
            {renderProgress()}
        </div>
    )
}

export default Progress
