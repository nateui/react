import { useCallback, useEffect } from 'react'
import classNames from '@/utils/class-names'
import { useTabs } from './context'
import { useConfig } from '../config-provider/index'
import type {
    KeyboardEvent,
    FocusEvent,
    MouseEvent,
    ReactNode,
    ComponentPropsWithRef,
} from 'react'
import type { TabsValue } from './context'

export type TabNavProps = ComponentPropsWithRef<'button'> & {
    disabled?: boolean
    icon?: string | ReactNode
    value: TabsValue
}

const TabNav = (props: TabNavProps) => {
    const {
        value: valueProp,
        disabled,
        className,
        icon,
        children,
        id: idProp,
        onClick,
        onFocus,
        onKeyDown,
        ref,
        type: typeProp,
        ...rest
    } = props
    const {
        activationMode = 'automatic',
        getPanelId,
        getTabId,
        onValueChange,
        registerTabId,
        value,
        variant,
    } = useTabs()
    const { classNames: configClassNames } = useConfig()
    const tabsClassNames = configClassNames?.tabs
    const isSelected = valueProp === value
    const tabId = idProp ?? getTabId?.(valueProp)
    const panelId = getPanelId?.(valueProp)

    useEffect(() => {
        if (idProp) {
            registerTabId?.(valueProp, idProp)
        }
    }, [idProp, registerTabId, valueProp])

    const activate = useCallback(() => {
        if (!isSelected && !disabled) {
            onValueChange?.(valueProp)
        }
    }, [disabled, isSelected, onValueChange, valueProp])

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (!event.defaultPrevented) activate()
        },
        [activate, onClick],
    )
    const handleFocus = useCallback(
        (event: FocusEvent<HTMLButtonElement>) => {
            onFocus?.(event)
            if (
                !event.defaultPrevented &&
                activationMode === 'automatic'
            ) {
                activate()
            }
        },
        [activationMode, activate, onFocus],
    )
    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            onKeyDown?.(event)
            if (
                !event.defaultPrevented &&
                (event.key === 'Enter' || event.key === ' ')
            ) {
                event.preventDefault()
                activate()
            }
        },
        [activate, onKeyDown],
    )

    const tabNavClass = classNames(
        'tab-nav group/tab font-semibold flex items-center justify-center transition duration-200 ease-in-out cursor-pointer z-10 focus:outline-none',
        `tab-nav-${variant}`,
        variant === 'underline' &&
            'tab-nav-underline py-2.5 px-4 border-b-2 border-transparent',
        variant === 'pill' && 'tab-nav-pill py-2 px-4',
        isSelected && 'tab-nav-active text-primary',
        isSelected && variant === 'pill' && 'text-primary-foreground',
        disabled && 'tab-nav-disabled opacity-60 cursor-not-allowed',
        !disabled && !isSelected && 'hover:text-primary',
        tabsClassNames?.trigger,
        className,
    )

    return (
        <button
            {...rest}
            ref={ref}
            id={tabId}
            type={typeProp ?? 'button'}
            className={tabNavClass}
            role="tab"
            aria-selected={isSelected}
            aria-controls={panelId}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : isSelected ? 0 : -1}
            disabled={disabled}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            data-value={valueProp}
            data-disabled={disabled ? '' : undefined}
            data-state={isSelected ? 'active' : 'inactive'}
            data-variant={variant}
        >
            {icon && (
                <span
                    className={classNames(
                        'tab-nav-icon ltr:mr-1.5 rtl:ml-1.5 text-lg',
                        tabsClassNames?.icon,
                    )}
                >
                    {icon}
                </span>
            )}
            {children}
        </button>
    )
}

export default TabNav
