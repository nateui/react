import classNames from '@/utils/class-names'
import { Check, Cross } from '../icons/index'
import { useConfig } from '../config-provider/index'
import { STEPS_STATUS } from './constants'
import type { StepStatus, StepItemProps } from './types'

const { COMPLETE, PENDING, IN_PROGRESS, ERROR } = STEPS_STATUS

const STEP_STATUS_ICON = {
    [COMPLETE]: <Check />,
    [PENDING]: null,
    [IN_PROGRESS]: null,
    [ERROR]: <Cross />,
}

const StepItem = (props: StepItemProps) => {
    const {
        className,
        customIcon,
        description,
        isLast,
        onStepChange,
        ref,
        status,
        stepNumber,
        title,
        vertical,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const stepsClassNames = configClassNames?.steps

    let stepIcon = (
        <span>{STEP_STATUS_ICON[status as StepStatus] ?? stepNumber}</span>
    )

    if (customIcon) {
        stepIcon = <span>{customIcon}</span>
    }

    const stepItemClass = classNames(
        `step-item group/step step-item-${status} flex items-center`,
        vertical && 'step-item-vertical items-start flex-col',
        stepsClassNames?.item,
        className,
    )

    const stepWrapperClass = classNames(
        'step-item-wrapper flex items-center',
        onStepChange && 'step-clickable cursor-pointer',
        stepsClassNames?.trigger,
    )

    const stepIconClass = classNames(
        `step-item-icon step-item-icon-${status} rounded-full size-6 flex items-center justify-center font-semibold leading-0`,
        status === PENDING &&
            'step-item-icon-pending border-2 border-input',
        status === COMPLETE && `bg-primary text-primary-foreground`,
        status === ERROR && `step-item-icon-error border-2 border-destructive text-destructive`,
        status === IN_PROGRESS &&
            `text-primary border-primary step-item-icon-current border-2`,
        stepsClassNames?.icon,
    )

    const stepConnectClass = classNames(
        'step-connect h-0.5 w-full',
        title ? 'step-title ms-2' : '',
        vertical ? 'step-connect-vertical min-h-14 w-0.5 ms-[11px]' : '',
        status === COMPLETE ? `bg-primary` : `inactive bg-border`,
        stepsClassNames?.connector,
    )

    const stepTitleClass = classNames(
        'step-item-title whitespace-nowrap font-semibold block',
        status === ERROR && `step-item-title-error text-destructive`,
        onStepChange && status !== ERROR && `hover:text-primary`,
        stepsClassNames?.title,
    )

    const handleStepChange = () => {
        onStepChange?.()
    }

    return (
        <div
            className={stepItemClass}
            {...rest}
            ref={ref}
            role="presentation"
            onClick={handleStepChange}
            data-state={status}
        >
            <div className={stepWrapperClass}>
                <div className={stepIconClass}>{stepIcon}</div>
                {title && (
                    <div
                        className={classNames(
                            'step-item-content ms-2 relative',
                            stepsClassNames?.content,
                        )}
                    >
                        {title && (
                            <span className={stepTitleClass}>{title}</span>
                        )}
                        {description && vertical && (
                            <span
                                className={classNames(
                                    'step-item-description',
                                    stepsClassNames?.description,
                                )}
                            >
                                {description}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {!isLast && <div className={stepConnectClass} />}
        </div>
    )
}

export default StepItem
