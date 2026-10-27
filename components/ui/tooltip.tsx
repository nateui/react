import { useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import { motion, AnimatePresence } from 'motion/react'
import type { ReactNode, ComponentProps } from 'react'
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
} from '@floating-ui/react'

type Placement =
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

export type TooltipProps = Omit<ComponentProps<'span'>, 'title'> & {
    open?: boolean
    placement?: Placement
    title: string | ReactNode
    wrapperClass?: string
    disabled?: boolean
}

const Tooltip = (props: TooltipProps) => {
    const {
        className,
        children,
        open = false,
        placement = 'top',
        title,
        wrapperClass,
        disabled,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const tooltipClassNames = configClassNames?.tooltip

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(open)

    const { refs, floatingStyles, context } = useFloating({
        open: tooltipOpen,
        onOpenChange: (open) => {
            if (!disabled) {
                setTooltipOpen(open)
            }
        },
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(3),
            flip({
                fallbackAxisSideDirection: 'start',
            }),
            shift(),
        ],
    })

    const hover = useHover(context, { move: false, restMs: 200 })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ])

    return (
        <>
            <span
                ref={refs.setReference}
                {...getReferenceProps()}
                className={classNames(
                    'tooltip-wrapper',
                    tooltipClassNames?.trigger,
                    wrapperClass,
                )}
                {...rest}
            >
                {children}
            </span>
            <FloatingPortal>
                {tooltipOpen && (
                    <AnimatePresence>
                        <motion.div
                            ref={refs.setFloating}
                            className={classNames(
                                'tooltip bg-inverse text-inverse-foreground z-tooltip max-w-[250px] rounded-control-sm py-1 px-2 relative shadow-popover',
                                tooltipClassNames?.content,
                                className,
                            )}
                            initial={{
                                opacity: 0,
                                visibility: 'hidden',
                            }}
                            animate={
                                tooltipOpen
                                    ? {
                                          opacity: 1,
                                          visibility: 'visible',
                                      }
                                    : {
                                          opacity: 0,
                                          visibility: 'hidden',
                                      }
                            }
                            transition={{
                                duration: 0.15,
                                type: 'tween',
                            }}
                            style={floatingStyles}
                            {...getFloatingProps()}
                        >
                            <span className={tooltipClassNames?.label}>
                                {title}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                )}
            </FloatingPortal>
        </>
    )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip

export { Tooltip }
