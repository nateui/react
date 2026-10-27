import { cloneElement, isValidElement } from 'react'
import Button from '../button'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import {
    usePopover,
    PopoverContext,
    usePopoverContext,
} from './hooks/use-popover'
import {
    useMergeRefs,
    FloatingFocusManager,
    FloatingPortal,
    useTransitionStyles,
} from '@floating-ui/react'
import transition from '@/utils/transitions'
import type { ReactNode, Ref, ComponentProps } from 'react'

export type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'

interface PopoverOptions {
    placement?: Placement
    modal?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: 'click' | 'hover'
    width?: number | string
}

export type PopoverTriggerProps = ComponentProps<'span'> & {
    children: ReactNode
    renderTrigger?: ReactNode
    ref?: Ref<HTMLElement>
}

export type PopoverContentProps = Omit<ComponentProps<'div'>, 'title'> & {
    ref?: Ref<HTMLDivElement>
    renderTrigger?: ReactNode
    title?: string | ReactNode
    width?: number | string
}

export type PopoverProps = PopoverOptions & PopoverContentProps

export const PopoverTrigger = ({
    children,
    renderTrigger,
    ref: propRef,
    ...props
}: PopoverTriggerProps) => {
    const context = usePopoverContext()
    const { classNames: configClassNames } = useConfig()
    const popoverClassNames = configClassNames?.popover
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childrenRef = (renderTrigger as any)?.ref
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

    if (renderTrigger && isValidElement(renderTrigger)) {
        const childProps = renderTrigger.props as object
        return cloneElement(
            renderTrigger,
            context.getReferenceProps({
                ref,
                ...props,
                ...childProps,
                className: classNames(
                    popoverClassNames?.trigger,
                    props.className,
                    (childProps as { className?: string }).className,
                ),
            }),
        )
    }

    return (
        <Button
            ref={ref as Ref<HTMLButtonElement>}
            data-state={context.open ? 'open' : 'closed'}
            className={classNames(
                'button bg-control border border-control-border text-control-foreground hover:bg-control-hover hover:border-control-border rounded-control px-4',
                popoverClassNames?.trigger,
            )}
            {...context.getReferenceProps(props)}
        >
            {children}
        </Button>
    )
}

const PopoverContent = (props: PopoverContentProps) => {
    const {
        ref: propRef,
        renderTrigger,
        children,
        title,
        id,
        className,
        style,
        width,
        ...rest
    } = props

    const { context: floatingContext, ...context } = usePopoverContext()
    const { classNames: configClassNames } = useConfig()
    const popoverClassNames = configClassNames?.popover
    const ref = useMergeRefs([context.refs.setFloating, propRef])

    const floatingTransition = useTransitionStyles(floatingContext, {
        duration: { open: 200, close: 200 },
        ...transition(floatingContext.placement),
    })

    return (
        <>
            <PopoverTrigger renderTrigger={renderTrigger} {...rest}>
                {title}
            </PopoverTrigger>
            {floatingTransition.isMounted && (
                <FloatingPortal>
                    <FloatingFocusManager
                        context={floatingContext}
                        modal={context.modal}
                    >
                        <div
                            className="popover-wrapper z-popover"
                            ref={ref}
                            style={{ ...floatingContext.floatingStyles }}
                            aria-labelledby={context.labelId}
                            aria-describedby={context.descriptionId}
                            {...context.getFloatingProps(rest)}
                        >
                            <div
                                id={id}
                                style={{ ...floatingTransition.styles }}
                                className={classNames(
                                    'popover relative rounded-popover bg-popover text-popover-foreground ring-0 shadow-popover border focus:outline-none min-w-[220px]',
                                    popoverClassNames?.content,
                                )}
                            >
                                <div
                                    className={classNames(
                                        'popover-content p-4',
                                        popoverClassNames?.body,
                                        className,
                                    )}
                                    style={{ ...style, width }}
                                >
                                    {children}
                                </div>
                            </div>
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </>
    )
}

const Popover = (props: PopoverProps) => {
    const {
        children,
        modal = false,
        renderTrigger,
        trigger,
        title,
        id,
        className,
        style,
        width,
        ...rest
    } = props

    const popover = usePopover({ modal, trigger, ...rest })

    const contentProps = {
        id,
        className,
        style,
        width,
    }

    return (
        <PopoverContext.Provider value={popover}>
            <PopoverContent
                renderTrigger={renderTrigger}
                title={title}
                {...contentProps}
            >
                {children}
            </PopoverContent>
        </PopoverContext.Provider>
    )
}

export default Popover
