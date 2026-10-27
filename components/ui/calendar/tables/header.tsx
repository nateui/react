import classNames from '@/utils/class-names'
import { useConfig } from '../../config-provider/index'
import type { ComponentProps } from 'react'

export interface HeaderProps extends ComponentProps<'div'> {
    hasNext: boolean
    hasPrevious: boolean
    onNext?: () => void
    onPrevious?: () => void
    onNextLevel?: () => void
    label?: string
    nextLevelDisabled?: boolean
    nextLabel?: string
    previousLabel?: string
    preventLevelFocus?: boolean
    preventFocus?: boolean
}

const ChevronRight = (props: ComponentProps<'svg'>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        aria-hidden="true"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            fillRule="evenodd"
            stroke="none"
            d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"
            clipRule="evenodd"
        />
    </svg>
)

const ChevronLeft = (props: ComponentProps<'svg'>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        aria-hidden="true"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            fillRule="evenodd"
            stroke="none"
            d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"
            clipRule="evenodd"
        />
    </svg>
)

const Header = (props: HeaderProps) => {
    const {
        hasNext,
        hasPrevious,
        onNext,
        onPrevious,
        onNextLevel,
        label,
        nextLevelDisabled,
        nextLabel,
        previousLabel,
        preventLevelFocus = false,
        preventFocus,
        children,
        className,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const calendarClassNames = configClassNames?.calendar

    const headerLabel = (
        <button
            className={classNames(
                'picker-header-label cursor-pointer select-none text-foreground text-base font-semibold rounded-control hover:text-primary',
                calendarClassNames?.headerLabel,
            )}
            disabled={nextLevelDisabled}
            tabIndex={preventLevelFocus ? -1 : 0}
            type="button"
            onClick={onNextLevel}
            onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
            {label}
        </button>
    )

    const renderChildren = children ? children : headerLabel

    return (
        <div
            className={classNames(
                'picker-header flex items-center justify-between pb-2',
                calendarClassNames?.header,
                className,
            )}
            {...rest}
        >
            <div
                className={
                    'flex justify-between w-full items-center rtl:flex-row-reverse'
                }
            >
                <button
                    type="button"
                    className={classNames(
                        'picker-direction-button text-xl rounded-control h-8 w-8 flex items-center justify-center hover:text-accent-foreground hover:bg-accent',
                        !hasPrevious && 'opacity-0 cursor-default',
                        calendarClassNames?.previousTrigger,
                    )}
                    disabled={!hasPrevious}
                    aria-label={previousLabel}
                    onClick={onPrevious}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronLeft />
                </button>
                {renderChildren}
                <button
                    type="button"
                    className={classNames(
                        'picker-direction-button text-xl rounded-control h-8 w-8 flex items-center justify-center hover:text-accent-foreground hover:bg-accent',
                        !hasNext && 'opacity-0 cursor-default',
                        calendarClassNames?.nextTrigger,
                    )}
                    disabled={!hasNext}
                    aria-label={nextLabel}
                    onClick={onNext}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    )
}

export default Header
