'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import CloseButton from './close-button'
import { Danger, Info, Success, Warning } from './icons/index'
import type { ReactNode, MouseEvent, Ref } from 'react'

export type AlertVariant = 'success' | 'warning' | 'destructive' | 'info'

export type AlertProps = Omit<HTMLMotionProps<'div'>, 'type' | 'children'> & {
    children?: ReactNode
    closable?: boolean
    customClose?: ReactNode | string
    customIcon?: ReactNode | string
    contentClass?: string
    duration?: number
    title?: ReactNode | string
    onClose?: (e?: MouseEvent<HTMLDivElement>) => void
    showIcon?: boolean
    triggerByToast?: boolean
    variant?: AlertVariant
    ref?: Ref<HTMLDivElement>
}

const DEFAULT_VARIANT: AlertVariant = 'warning'

const VARIANT_MAP = {
    success: {
        backgroundColor: 'bg-success-soft',
        titleColor: 'text-success',
        textColor: 'text-success',
        iconColor: 'text-success',
        borderColor: 'border-success/30',
        icon: Success,
    },
    info: {
        backgroundColor: 'bg-info-soft',
        titleColor: 'text-info',
        textColor: 'text-info',
        iconColor: 'text-info',
        borderColor: 'border-info/30',
        icon: Info,
    },
    warning: {
        backgroundColor: 'bg-warning-soft',
        titleColor: 'text-warning',
        textColor: 'text-warning',
        iconColor: 'text-warning',
        borderColor: 'border-warning/30',
        icon: Warning,
    },
    destructive: {
        backgroundColor: 'bg-destructive-soft',
        titleColor: 'text-destructive',
        textColor: 'text-destructive',
        iconColor: 'text-destructive',
        borderColor: 'border-destructive/30',
        icon: Danger,
    },
}

const VARIANTS: AlertVariant[] = [
    'success',
    'destructive',
    'info',
    'warning',
]

const Alert = (props: AlertProps) => {
    const {
        children,
        className,
        closable = false,
        customClose,
        customIcon,
        contentClass,
        duration = 3000,
        title = null,
        onClose,
        ref,
        showIcon: showIconProp,
        variant: variantProp,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const showIcon =
        showIconProp ?? componentDefaults?.alert?.showIcon ?? false
    const configuredVariant =
        variantProp ?? componentDefaults?.alert?.variant
    const resolvedVariant: AlertVariant =
        configuredVariant && VARIANTS.includes(configuredVariant)
            ? configuredVariant
            : DEFAULT_VARIANT

    const variantMap = VARIANT_MAP[resolvedVariant]
    const Icon = variantMap.icon
    const alertClassNames = configClassNames?.alert

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

    const handleClose = (e: MouseEvent<HTMLDivElement>) => {
        setDisplay('hiding')
        onClose?.(e)
        clear()
    }

    const renderClose = () => {
        return (
            <>
                {customClose ? <>{customClose}</> : (
                    <div
                        className={classNames('cursor-pointer flex', alertClassNames?.close)}
                        role="presentation"
                        onClick={(e) => handleClose(e)}
                    >
                        <CloseButton
                            className={classNames(
                                'outline-hidden hover:bg-transparent',
                                alertClassNames?.close,
                            )}
                            aria-label="close alert"
                        />
                    </div>
                )}
            </>
        )
    }

    const alertClass = classNames(
        'alert group/alert p-4 relative flex border text-foreground font-normal rounded-card',
        variantMap.backgroundColor,
        variantMap.borderColor,
        closable ? 'justify-between' : '',
        closable && !title ? 'items-center' : '',
        alertClassNames?.root,
        className,
    )

    if (display === 'hide') {
        return null
    }

    return (
        <motion.div
            ref={ref}
            className={alertClass}
            initial={{ opacity: 1 }}
            animate={display === 'hiding' ? 'exit' : 'animate'}
            transition={{ duration: 0.25, type: 'tween' }}
            variants={{
                animate: {
                    opacity: 1,
                },
                exit: {
                    opacity: 0,
                },
            }}
            {...rest}
            data-variant={resolvedVariant}
        >
            <div className={classNames('flex gap-2', contentClass, alertClassNames?.content)}>
                {showIcon && (
                    <span
                        className={classNames(
                            'text-xl mt-0.25',
                            variantMap.iconColor,
                            alertClassNames?.icon,
                        )}
                    >
                        {customIcon || <Icon />}
                    </span>
                )}
                <div>
                    {title ? (
                        <div
                            className={classNames(
                                'alert-title font-semibold text-foreground mb-1',
                                alertClassNames?.title,
                            )}
                        >
                            {title}
                        </div>
                    ) : null}
                    {children && alertClassNames?.description ? (
                        <div className={alertClassNames.description}>
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
            {closable ? renderClose() : null}
        </motion.div>
    )
}

export default Alert

export { Alert }
