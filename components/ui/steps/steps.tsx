import { Children } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { STEPS_STATUS } from './constants'
import mapCloneElement from '@/utils/map-clone-element'
import type { StepStatus, StepItemProps } from './types'
import type { ComponentPropsWithRef } from 'react'

const { COMPLETE, PENDING, IN_PROGRESS, ERROR } = STEPS_STATUS

export type StepsProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
    current?: number
    onChange?: (index: number) => void
    status?: StepStatus
    vertical?: boolean
}

const Steps = (props: StepsProps) => {
    const {
        className,
        children,
        vertical = false,
        current = 0,
        status = IN_PROGRESS,
        onChange,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const stepsClassNames = configClassNames?.steps

    const count = Children.count(children)

    const items = mapCloneElement(
        children,
        (item: { props: StepItemProps }, index: number) => {
            const itemStyles = {
                flexBasis:
                    index < count - 1 ? `${100 / (count - 1)}%` : undefined,
                maxWidth: index === count - 1 ? `${100 / count}%` : undefined,
            }
            const itemProps: StepItemProps = {
                stepNumber: index + 1,
                status: PENDING as StepStatus,
                style: !vertical ? itemStyles : undefined,
                isLast: index === count - 1,
                vertical: vertical,
                onStepChange: onChange ? () => onChange(index) : undefined,
                ...item.props,
            }

            if (status === ERROR && index === (current as number) - 1) {
                itemProps.className = classNames('steps-item-error')
            }

            if (!item.props.status) {
                if (index === current) {
                    itemProps.status = status as StepStatus
                    itemProps.className = classNames(
                        itemProps.className,
                        'steps-item-active',
                    )
                } else if (index < (current as number)) {
                    itemProps.status = COMPLETE as StepStatus
                }
            }
            return itemProps
        },
    )

    return (
        <div
            ref={ref}
            className={classNames(
                'steps flex justify-between items-center',
                vertical && 'steps-vertical flex-col items-start',
                stepsClassNames?.root,
                className,
            )}
            {...rest}
        >
            {items}
        </div>
    )
}

export default Steps
