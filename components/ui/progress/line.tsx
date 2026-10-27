import classNames from '@/utils/class-names'
import { useConfig, SIZES } from '../config-provider/index'
import type { ComponentProps } from 'react'

type LineProps = ComponentProps<'div'> & {
    percent: number
    strokeColor?: string
    trailClass?: string
    size?: 'sm' | 'md'
}

const Line = (props: LineProps) => {
    const { percent, size, children, strokeColor, trailClass } = props
    const { classNames: configClassNames } = useConfig()
    const progressClassNames = configClassNames?.progress

    const progressBackgroundClass = classNames(
        'progress-bg rounded-full transition-all duration-200',
        size === SIZES.SM ? 'progress-line-sm h-1' : 'progress-line-base h-1.5',
        progressClassNames?.indicator,
        strokeColor,
    )

    return (
        <>
            <div className={classNames('progress-wrapper w-full', progressClassNames?.track)}>
                <div
                    className={classNames(
                        'progress-inner relative w-full overflow-hidden rounded-full bg-muted',
                        progressClassNames?.trail,
                        trailClass,
                    )}
                >
                    <div
                        className={progressBackgroundClass}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
            {children}
        </>
    )
}

export default Line
