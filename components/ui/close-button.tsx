import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { MouseEvent, ComponentProps, ButtonHTMLAttributes, Ref } from 'react'

export interface CloseButtonProps
    extends ComponentProps<'button'>, ButtonHTMLAttributes<HTMLButtonElement> {
    absolute?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    ref?: Ref<HTMLButtonElement>
    resetDefaultClass?: boolean
}

const CloseButton = (props: CloseButtonProps) => {
    const { absolute, className, resetDefaultClass, ref, children, ...rest } =
        props
    const { classNames: configClassNames } = useConfig()
    const closeButtonClassNames = configClassNames?.closeButton
    const closeButtonAbsoluteClass = 'absolute z-10'

    const closeButtonClass = classNames(
        !resetDefaultClass &&
            'close-button outline-none text-lg rounded-full p-1.5 hover:text-foreground button-press-feedback transition-transform active:translate-y-[1px] text-foreground/70 hover:bg-muted hover:text-foreground rounded-control',
        absolute && closeButtonAbsoluteClass,
        closeButtonClassNames?.root,
        className,
    )

    return (
        <button ref={ref} className={closeButtonClass} type="button" {...rest}>
            {children ? (
                children
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    height="1em"
                    width="1em"
                    className={closeButtonClassNames?.icon}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
            )}
        </button>
    )
}

export default CloseButton
