import CloseButton from './close-button'
import { DialogContext, useDialogContext, useDialog } from '@/hooks/use-dialog'
import useResponsive from '@/hooks/use-responsive'
import { useConfig } from './config-provider/index'
import classNames from '@/utils/class-names'
import {
    useMergeRefs,
    FloatingPortal,
    FloatingFocusManager,
    FloatingOverlay,
    useTransitionStyles,
} from '@floating-ui/react'
import type { CSSProperties, Ref, ComponentProps } from 'react'
export interface DialogProps extends ComponentProps<'div'> {
    closable?: boolean
    height?: string | number
    isOpen?: boolean
    lockScroll?: boolean
    onClose?: (close: boolean) => void
    onOpen?: (open: boolean) => void
    overlayClassName?: string
    shouldCloseOnOverlayClick?: boolean
    shouldCloseOnEsc?: boolean
    width?: number
    ref?: Ref<HTMLDivElement>
}

const DialogContent = (props: DialogProps) => {
    const {
        closable = true,
        height,
        children,
        width = 520,
        lockScroll = false,
        ref: propRef,
        onClose,
        overlayClassName,
        className,
        ...rest
    } = props
    const { windowWidth } = useResponsive()
    const { classNames: configClassNames } = useConfig()
    const dialogClassNames = configClassNames?.dialog
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

    const backdropTransition = useTransitionStyles(floatingContext, {
        duration: { open: 150, close: 150 },
    })

    const floatingTransition = useTransitionStyles(floatingContext, {
        duration: { open: 200, close: 150 },
        initial: {
            opacity: 0,
            transform: 'scale(0.9)',
        },
        close: {
            opacity: 0,
            transform: 'scale(0.9)',
        },
    })

    const renderCloseButton = (
        <CloseButton
            absolute
            className={classNames(
                'ltr:right-4 rtl:left-4 top-4',
                dialogClassNames?.close,
            )}
            onClick={() => onClose?.(context.open as boolean)}
            aria-label="close dialog"
        />
    )

    return (
        <FloatingPortal>
            {backdropTransition.isMounted && (
                <>
                    <FloatingOverlay
                        className={classNames(
                            'dialog-overlay bg-overlay backdrop-blur-md z-overlay',
                            dialogClassNames?.overlay,
                            overlayClassName,
                        )}
                        lockScroll={lockScroll}
                        style={backdropTransition.styles}
                    />
                    <div
                        className={classNames(
                            'dialog-content-wrapper fixed top-0 right-0 left-0 bottom-0 z-modal flex flex-col',
                            dialogClassNames?.wrapper,
                        )}
                    >
                        <FloatingFocusManager context={floatingContext}>
                            <div
                                className={classNames(
                                    'dialog-content p-4 rounded-overlay shadow-dialog mt-auto mb-auto xs:mx-auto mx-4 relative bg-card text-card-foreground',
                                    dialogClassNames?.content,
                                    className,
                                )}
                                style={{
                                    height,
                                    ...contentStyle,
                                    ...floatingTransition.styles,
                                }}
                                ref={ref}
                                aria-labelledby={context.labelId}
                                aria-describedby={context.descriptionId}
                                {...context.getFloatingProps(rest)}
                            >
                                {children}
                                {closable && renderCloseButton}
                            </div>
                        </FloatingFocusManager>
                    </div>
                </>
            )}
        </FloatingPortal>
    )
}

const Dialog = ({
    isOpen,
    shouldCloseOnOverlayClick = true,
    shouldCloseOnEsc = true,
    ...props
}: DialogProps) => {
    const dialog = useDialog({
        open: isOpen,
        onOpenChange: (open: boolean) => {
            if (open) {
                props.onOpen?.(open)
            } else {
                props.onClose?.(open)
            }
        },
        shouldCloseOnOverlayClick: shouldCloseOnOverlayClick,
        shouldCloseOnEsc: shouldCloseOnEsc,
    })
    return (
        <DialogContext.Provider value={dialog}>
            <DialogContent {...props} />
        </DialogContext.Provider>
    )
}

export default Dialog

export { Dialog }
