import {
    DialogContext as ActionBarContext,
    useDialogContext,
    useDialog,
} from '@/hooks/use-dialog'
import useResponsive from '@/hooks/use-responsive'
import { useConfig } from './config-provider/index'
import classNames from '@/utils/class-names'
import {
    useMergeRefs,
    FloatingPortal,
    FloatingFocusManager,
    useTransitionStyles,
} from '@floating-ui/react'
import type { UseTransitionStylesProps } from '@floating-ui/react'
import type { CSSProperties, Ref, ComponentProps } from 'react'
export type ActionBarProps = ComponentProps<'div'> & {
    contentClassName?: string
    open?: boolean
    shouldCloseOnEsc?: boolean
    shouldCloseOnOverlayClick?: boolean
    onOpenChange?: (open: boolean) => void
    width?: number
    /** Config passed to useTransitionStyles. */
    transitionProps?: UseTransitionStylesProps
    ref?: Ref<HTMLDivElement>
}

const ActionBarContent = (props: ActionBarProps) => {
    const {
        contentClassName,
        children,
        width = 480,
        ref: propRef,
        className,
        transitionProps,
        ...rest
    } = props
    const { windowWidth } = useResponsive()
    const { classNames: configClassNames } = useConfig()
    const actionBarClassNames = configClassNames?.actionBar
    const { context: floatingContext, ...context } = useDialogContext()
    const ref = useMergeRefs([context.refs.setFloating, propRef])

    const contentStyle: CSSProperties = {}

    if (width !== undefined) {
        contentStyle.width = width

        if (
            windowWidth > 0 && windowWidth <= width
        ) {
            contentStyle.width = 'auto'
        }
    }

    const floatingTransition = useTransitionStyles(
        floatingContext,
        transitionProps ?? {
            duration: { open: 200, close: 150 },
            initial: {
                opacity: 0,
                transform: 'translateY(10px) scale(0.95)',
            },
            close: {
                opacity: 0,
                transform: 'translateY(10px) scale(0.95)',
            },
        },
    )

    return (
        <FloatingPortal>
            {floatingTransition.isMounted && (
                <>
                    <div
                        className={classNames(
                            'action-bar fixed bottom-10 left-1/2 transform -translate-x-2/4 z-popover',
                            actionBarClassNames?.root,
                            className,
                        )}
                        style={{ ...contentStyle }}
                    >
                        <FloatingFocusManager context={floatingContext}>
                            <div
                                className={classNames(
                                    'action-bar-content p-4 rounded-popover border shadow-popover bg-popover text-popover-foreground',
                                    actionBarClassNames?.content,
                                    contentClassName,
                                )}
                                style={{
                                    ...floatingTransition.styles,
                                }}
                                ref={ref}
                                aria-labelledby={context.labelId}
                                aria-describedby={context.descriptionId}
                                {...context.getFloatingProps(rest)}
                            >
                                {children}
                            </div>
                        </FloatingFocusManager>
                    </div>
                </>
            )}
        </FloatingPortal>
    )
}

const ActionBar = ({
    open,
    onOpenChange,
    shouldCloseOnEsc = false,
    shouldCloseOnOverlayClick = true,
    ...props
}: ActionBarProps) => {
    const dialog = useDialog({
        open,
        onOpenChange,
        shouldCloseOnEsc: shouldCloseOnEsc,
        shouldCloseOnOverlayClick: shouldCloseOnOverlayClick,
    })
    return (
        <ActionBarContext.Provider value={dialog}>
            <ActionBarContent {...props} />
        </ActionBarContext.Provider>
    )
}

export default ActionBar

export { ActionBar }
