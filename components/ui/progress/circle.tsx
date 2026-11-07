import { useCallback } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ComponentProps } from 'react'

export type StrokeLinecap = 'round' | 'square'
export type GapPosition = 'top' | 'right' | 'bottom' | 'left'

export type CircleProps = ComponentProps<'div'> & {
    gapDegree: number
    gapPosition: GapPosition
    percent: number
    strokeColor?: string
    strokeLinecap: StrokeLinecap
    strokeWidth: number
    trailClass?: string
    width?: number | string
}

const Circle = (props: CircleProps) => {
    const {
        strokeWidth,
        percent,
        strokeLinecap,
        gapDegree,
        gapPosition,
        strokeColor,
        trailClass,
        width,
        children,
    } = props
    const { classNames: configClassNames } = useConfig()
    const progressClassNames = configClassNames?.progress

    const getPathStyles = useCallback(() => {
        const radius = 50 - strokeWidth / 2

        let beginPositionX = 0
        let beginPositionY = -radius
        let endPositionX = 0
        let endPositionY = -2 * radius

        switch (gapPosition) {
            case 'left':
                beginPositionX = -radius
                beginPositionY = 0
                endPositionX = 2 * radius
                endPositionY = 0
                break
            case 'right':
                beginPositionX = radius
                beginPositionY = 0
                endPositionX = -2 * radius
                endPositionY = 0
                break
            case 'bottom':
                beginPositionY = radius
                endPositionY = 2 * radius
                break
            default:
        }

        const pathString = `M 50,50 m ${beginPositionX},${beginPositionY} a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY} a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`

        const len = Math.PI * 2 * radius
        const trailPathStyle = {
            strokeDasharray: `${len - gapDegree}px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`,
        }

        const strokePathStyle = {
            strokeDasharray: `${
                (percent / 100) * (len - gapDegree)
            }px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`,
        }

        return {
            pathString,
            trailPathStyle,
            strokePathStyle,
        }
    }, [gapDegree, gapPosition, percent, strokeWidth])

    const { pathString, trailPathStyle, strokePathStyle } = getPathStyles()

    const progressStrokeClass = classNames(
        'progress-circle-stroke stroke-current transition-all duration-200',
        progressClassNames?.indicator,
        strokeColor,
    )

    return (
        <div
            className={classNames('progress-circle relative', progressClassNames?.track)}
            style={{ width: width }}
        >
            <span className="progress-circle-info absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {children}
            </span>
            <svg viewBox="0 0 100 100">
                <path
                    d={pathString}
                    strokeWidth={strokeWidth}
                    fillOpacity="0"
                    style={trailPathStyle}
                    className={classNames(
                        'progress-circle-trail stroke-current text-border',
                        progressClassNames?.trail,
                        trailClass,
                    )}
                />
                <path
                    d={pathString}
                    strokeLinecap={strokeLinecap}
                    strokeWidth={percent === 0 ? 0 : strokeWidth}
                    fillOpacity="0"
                    style={strokePathStyle}
                    className={progressStrokeClass}
                />
            </svg>
        </div>
    )
}

export default Circle
