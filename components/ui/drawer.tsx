import CloseButton from './close-button'
import { DialogContext, useDialogContext, useDialog } from '@/hooks/use-dialog'
import { useConfig } from './config-provider/index'
import classNames from '@/utils/class-names'
import {
    useMergeRefs,
    FloatingPortal,
    FloatingFocusManager,
    FloatingOverlay,
    useTransitionStyles,
} from '@floating-ui/react'
import { motion, useMotionValue, useDragControls, animate } from 'motion/react'
import { useEffect } from 'react'
import type { CSSProperties, Ref, ReactNode, ComponentProps } from 'react'
import type { PanInfo } from 'motion/react'

export type DrawerProps = Omit<ComponentProps<'div'>, 'title'> & {
    bodyClass?: string
    closable?: boolean
    contentClassName?: string
    footer?: string | ReactNode
    footerClass?: string
    headerClass?: string
    height?: string | number
    isOpen?: boolean
    lockScroll?: boolean
    onClose?: (close: boolean) => void
    onOpen?: (open: boolean) => void
    overlayClassName?: string
    placement?: 'top' | 'right' | 'bottom' | 'left'
    shouldCloseOnOverlayClick?: boolean
    shouldCloseOnEsc?: boolean
    width?: number
    title?: string | ReactNode
    ref?: Ref<HTMLDivElement>
}

const DEFAULT_SIZE = 370

const DISMISS_OFFSET = 120
const DISMISS_VELOCITY = 600
const OVERSCROLL_ELASTIC = 0.2

const DrawerContent = (props: DrawerProps) => {
    const {
        bodyClass,
        closable = true,
        contentClassName,
        height = DEFAULT_SIZE,
        headerClass,
        footerClass,
        children,
        footer,
        lockScroll = true,
        ref: propRef,
        onClose,
        overlayClassName,
        placement = 'right',
        width = DEFAULT_SIZE,
        title,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const drawerClassNames = configClassNames?.drawer
    const { context: floatingContext, ...context } = useDialogContext()
    const ref = useMergeRefs([context.refs.setFloating, propRef])

    const contentStyle: CSSProperties = {}

    const enableDrag = placement === 'top' || placement === 'bottom'
    const dragControls = useDragControls()
    const y = useMotionValue(0)

    const travel = typeof height === 'number' ? height : 9999

    const dragConstraints =
        placement === 'bottom'
            ? { top: 0, bottom: travel }
            : placement === 'top'
              ? { top: -travel, bottom: 0 }
              : undefined

    const dragElastic =
        placement === 'bottom'
            ? { top: OVERSCROLL_ELASTIC, bottom: 0 }
            : placement === 'top'
              ? { top: 0, bottom: OVERSCROLL_ELASTIC }
              : undefined

    const requestClose = () => onClose?.(context.open as boolean)

    const handleDragEnd = (info: PanInfo) => {
        const dismissed =
            placement === 'bottom'
                ? info.offset.y > DISMISS_OFFSET ||
                  info.velocity.y > DISMISS_VELOCITY
                : info.offset.y < -DISMISS_OFFSET ||
                  info.velocity.y < -DISMISS_VELOCITY

        if (dismissed) {
            requestClose()
        } else {
            animate(y, 0, { type: 'spring', stiffness: 500, damping: 45 })
        }
    }

    const backdropTransition = useTransitionStyles(floatingContext, {
        duration: { open: 150, close: 150 },
    })

    const getPlacementStyle = (
        state: 'initial' | 'close' | 'open',
    ): CSSProperties => {
        let value = ''

        const isHorizontal = placement === 'left' || placement === 'right'
        const isVertical = placement === 'top' || placement === 'bottom'

        if (state === 'open') {
            return {
                [placement]: 0,
                ...(isHorizontal ? { width } : { height }),
            }
        }

        if (state === 'close' || state === 'initial') {
            value = '-'
        }

        if (isHorizontal) {
            return {
                [placement]: `${value}${width}${
                    typeof width === 'number' && 'px'
                }`,
                width: width,
            }
        }

        if (isVertical) {
            return {
                [placement]: `${value}${height}${
                    typeof height === 'number' && 'px'
                }`,
                height: height,
            }
        }

        return {}
    }

    const getPlacementClass = () => {
        const classes: string[] = []

        if (placement === 'left' || placement === 'right') {
            classes.push('horizontal h-full')
        }

        if (placement === 'top' || placement === 'bottom') {
            classes.push('vertical w-full')
        }

        classes.push('drawer-floating rounded-overlay m-2')
        classes.push(`drawer-floating-${placement}`)

        if (placement === 'right') {
            classes.push('right-0 top-0 bottom-0 h-auto')
        }

        if (placement === 'left') {
            classes.push('left-0 top-0 bottom-0 h-auto')
        }

        if (placement === 'top') {
            classes.push('top-0 left-0 right-0 w-auto')
        }

        if (placement === 'bottom') {
            classes.push('bottom-0 left-0 right-0 w-auto')
        }

        return classes.join(' ')
    }

    const floatingTransition = useTransitionStyles(floatingContext, {
        duration: { open: 250, close: 250 },
        initial: {
            opacity: 0,
            ...getPlacementStyle('initial'),
        },
        open: {
            opacity: 1,
            ...getPlacementStyle('open'),
        },
        close: {
            opacity: 0,
            ...getPlacementStyle('close'),
        },
    })

    useEffect(() => {
        if (!floatingTransition.isMounted) {
            y.set(0)
        }
    }, [floatingTransition.isMounted, y])

    const renderCloseButton = (
        <CloseButton
            absolute
            className={classNames(
                'ltr:right-4 rtl:left-4 top-3',
                drawerClassNames?.close,
            )}
            onClick={requestClose}
            aria-label="close drawer"
        />
    )

    const renderHandle = (
        <div
            className={classNames(
                'drawer-handle flex shrink-0 justify-center touch-none cursor-grab active:cursor-grabbing',
                placement === 'bottom' ? 'pt-2.5 pb-1' : 'pb-2.5 pt-1',
                drawerClassNames?.handle,
            )}
            onPointerDown={(event) => dragControls.start(event)}
            aria-hidden
        >
            <span className="h-1.5 w-11 rounded-full bg-border" />
        </div>
    )

    return (
        <FloatingPortal>
            {backdropTransition.isMounted && (
                <>
                    <FloatingOverlay
                        className={classNames(
                            'drawer-overlay bg-overlay inset-0 fixed backdrop-blur-md z-overlay transition-all duration-300 ease-in-out',
                            drawerClassNames?.overlay,
                            overlayClassName,
                        )}
                        lockScroll={lockScroll}
                        style={backdropTransition.styles}
                    />
                    <div
                        className={classNames(
                            'drawer-content-wrapper fixed top-0 right-0 left-0 bottom-0 z-modal',
                            drawerClassNames?.wrapper,
                        )}
                    >
                        <FloatingFocusManager context={floatingContext}>
                            <motion.div
                                className={classNames(
                                    'drawer-content bg-card text-card-foreground shadow-drawer absolute flex flex-col',
                                    getPlacementClass(),
                                    drawerClassNames?.content,
                                    contentClassName,
                                )}
                                style={{
                                    ...contentStyle,
                                    ...floatingTransition.styles,
                                    y: enableDrag ? y : undefined,
                                }}
                                ref={ref}
                                aria-labelledby={context.labelId}
                                aria-describedby={context.descriptionId}
                                drag={enableDrag ? 'y' : false}
                                dragListener={false}
                                dragControls={dragControls}
                                dragConstraints={dragConstraints}
                                dragElastic={dragElastic}
                                dragMomentum={false}
                                onDragEnd={(_, info) => handleDragEnd(info)}
                                {...context.getFloatingProps(rest)}
                            >
                                {enableDrag &&
                                    placement === 'bottom' &&
                                    renderHandle}
                                {title || closable ? (
                                    <div
                                        className={classNames(
                                            'drawer-header flex items-center justify-between p-4 border-b',
                                            drawerClassNames?.header,
                                            headerClass,
                                        )}
                                    >
                                        {typeof title === 'string' ? (
                                            <div className={classNames('text-lg font-semibold text-foreground', drawerClassNames?.title)}>
                                                {title}
                                            </div>
                                        ) : (
                                            <div
                                                className={drawerClassNames?.title}
                                            >
                                                {title}
                                            </div>
                                        )}
                                        {closable && renderCloseButton}
                                    </div>
                                ) : null}
                                <div
                                    className={classNames(
                                        'drawer-body p-4 h-full overflow-y-auto',
                                        drawerClassNames?.body,
                                        bodyClass,
                                    )}
                                >
                                    {children}
                                </div>
                                {footer && (
                                    <div
                                        className={classNames(
                                            'drawer-footer flex items-center justify-between py-3.5 px-4 border-t',
                                            drawerClassNames?.footer,
                                            footerClass,
                                        )}
                                    >
                                        {footer}
                                    </div>
                                )}
                                {enableDrag &&
                                    placement === 'top' &&
                                    renderHandle}
                            </motion.div>
                        </FloatingFocusManager>
                    </div>
                </>
            )}
        </FloatingPortal>
    )
}

const Drawer = ({
    isOpen,
    shouldCloseOnOverlayClick,
    shouldCloseOnEsc,
    ...props
}: DrawerProps) => {
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
            <DrawerContent {...props} />
        </DialogContext.Provider>
    )
}

export default Drawer

export { Drawer }
