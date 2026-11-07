import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import CloseButton from './close-button'
import { Danger, Info, Success, Warning } from './icons/index'
import type { TypeAttributes } from './config-provider/types'
import type { ReactNode, MouseEvent, Ref, ComponentProps } from 'react'

export type NotificationProps = ComponentProps<'div'> & {
    closable?: boolean
    customIcon?: ReactNode | string
    duration?: number
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    ref?: Ref<HTMLDivElement>
    title?: string
    titleClass?: string
    triggerByToast?: boolean
    type?: TypeAttributes.Status
    width?: number | string
}

const STATUS_ICON_MAP = {
    success: {
        className: 'text-success',
        icon: <Success />,
    },
    info: {
        className: 'text-info',
        icon: <Info />,
    },
    warning: {
        className: 'text-warning',
        icon: <Warning />,
    },
    danger: {
        className: 'text-destructive',
        icon: <Danger />,
    },
}

const Notification = (props: NotificationProps) => {
    const {
        className,
        children,
        closable = false,
        customIcon,
        duration = 3000,
        onClose,
        style,
        ref,
        title,
        titleClass,
        triggerByToast,
        type,
        width = 350,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const notificationClassNames = configClassNames?.notification
    const statusIcon = type ? STATUS_ICON_MAP[type] : null

    const [display, setDisplay] = useState('show')

    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
    const onCloseRef = useRef<(() => void) | undefined>(
        onClose as (() => void) | undefined,
    )

    const clear = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
    }, [])

    useEffect(() => {
        onCloseRef.current = onClose as (() => void) | undefined
    }, [onClose])

    useEffect(() => {
        clear()
        if (duration > 0) {
            timeout.current = setTimeout(() => {
                onCloseRef.current?.()
            }, duration)
        }

        return clear
    }, [duration, clear])

    const handleClose = useCallback(
        (e: MouseEvent<HTMLSpanElement>) => {
            setDisplay('hiding')
            onClose?.(e)
            clear()
            if (!triggerByToast) {
                setTimeout(() => {
                    setDisplay('hide')
                }, 400)
            }
        },
        [onClose, clear, triggerByToast],
    )

    const notificationClass = classNames(
        'notification group/notification bg-card text-card-foreground shadow-card rounded-card mb-2 relative border gap-4',
        notificationClassNames?.root,
        className,
    )

    if (display === 'hide') {
        return null
    }

    return (
        <div
            ref={ref}
            {...rest}
            className={notificationClass}
            data-type={type || undefined}
            style={{ width: width, ...style }}
        >
            <div
                className={classNames(
                    'notification-content p-4 flex gap-2',
                    !children && 'no-child items-center',
                    notificationClassNames?.content,
                )}
            >
                {statusIcon && !customIcon ? (
                    <div
                        className={classNames(
                            'mt-0.5',
                            notificationClassNames?.icon,
                        )}
                    >
                        <span
                            className={classNames(
                                'text-xl',
                                statusIcon.className,
                            )}
                        >
                            {statusIcon.icon}
                        </span>
                    </div>
                ) : null}
                {customIcon && (
                    <div className={classNames(notificationClassNames?.icon)}>
                        {customIcon}
                    </div>
                )}
                <div className="flex-1">
                    {title && (
                        <div
                            className={classNames(
                                'notification-title font-semibold text-foreground',
                                notificationClassNames?.title,
                                titleClass,
                            )}
                        >
                            {title}
                        </div>
                    )}
                    <div
                        className={classNames(
                            'notification-description text-muted-foreground',
                            !title && children ? 'mt-0.5' : '',
                            notificationClassNames?.description,
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {closable && (
                <CloseButton
                    absolute
                    className={classNames(
                        'notification-close top-3 ltr:right-4 rtl:left-4 hover:bg-accent hover:text-accent-foreground rounded-control',
                        notificationClassNames?.close,
                    )}
                    onClick={handleClose}
                    aria-label="close notification"
                />
            )}
        </div>
    )
}

export default Notification

export { Notification }
