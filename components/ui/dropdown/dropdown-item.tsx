import {
    useContext,
    useCallback,
    useId,
    isValidElement,
    cloneElement,
} from 'react'
import isNil from '@/utils/is-nil'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import DropdownContext from './context/dropdown-context'
import MenuContext from './context/menu-context'
import DropdownItemElement from './dropdown-item-element'
import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react'
import type {
    SyntheticEvent,
    ElementType,
    ReactElement,
    MouseEvent,
    FocusEvent,
    KeyboardEvent,
    Ref,
    ComponentProps,
} from 'react'

export type DropdownItemProps = ComponentProps<ElementType> & {
    asElement?: ElementType
    active?: boolean
    disabled?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    closeOnClick?: boolean
    submenu?: ReactElement<any>
    eventKey?: string
    onSelect?: (eventKey: string, e: SyntheticEvent) => void
    onFocus?: (e: SyntheticEvent) => void
    onClick?: (e: SyntheticEvent) => void
    ref?: Ref<HTMLElement>
    variant?: 'default' | 'header' | 'divider' | 'custom'
}

const DROPDOWN_ITEM_TYPE: Record<
    string,
    'default' | 'header' | 'divider' | 'custom'
> = {
    DEFAULT: 'default',
    HEADER: 'header',
    DIVIDER: 'divider',
    CUSTOM: 'custom',
}

const { DEFAULT, DIVIDER, HEADER, CUSTOM } = DROPDOWN_ITEM_TYPE

const DropdownItem = (props: DropdownItemProps) => {
    const {
        asElement: Component = 'li',
        children,
        active: activeProp,
        disabled,
        className,
        closeOnClick = true,
        style,
        eventKey,
        onSelect,
        onClick,
        onFocus,
        ref = null,
        variant = DEFAULT,
        role: roleProp,
        tabIndex: tabIndexProp,
        ...rest
    } = props

    const dropdown = useContext(DropdownContext)
    const menu = useContext(MenuContext)
    const { classNames: configClassNames } = useConfig()
    const dropdownClassNames = configClassNames?.dropdown

    const isInteractive = variant === DEFAULT || variant === CUSTOM
    const item = useListItem({
        label: isInteractive && !disabled ? undefined : null,
    })
    const menuitemRef = useMergeRefs([
        isInteractive ? item.ref : null,
        ref,
    ])

    const menuitemId = `menu-item-${useId()}`

    const active =
        activeProp ||
        (!isNil(dropdown?.activeKey) && dropdown?.activeKey === eventKey)

    const tree = useFloatingTree()

    const activate = useCallback(
        (e: SyntheticEvent) => {
            onSelect?.(eventKey || '', e)
            dropdown?.onSelect?.(eventKey || '', e)
            onClick?.(e)
        },
        [dropdown, eventKey, onClick, onSelect],
    )

    const handleClick = useCallback(
        (e: SyntheticEvent) => {
            if (disabled) {
                e.preventDefault()
                e.stopPropagation()
                return
            }

            activate(e)
            if (closeOnClick) {
                tree?.events.emit('click', e.nativeEvent)
            }
        },
        [disabled, activate, tree?.events],
    )

    const menuitemEventHandlers = {
        ...menu.getItemProps({
            onClick(event: MouseEvent<HTMLElement>) {
                handleClick(event)
            },
            onFocus(event: FocusEvent<HTMLElement>) {
                onFocus?.(event)
                menu.setHasFocusInside(true)
            },
            onKeyDown(event: KeyboardEvent<HTMLElement>) {
                const isNativeButton = Component === 'button'
                const isNativeLink = Component === 'a'
                const shouldActivate =
                    (event.key === 'Enter' &&
                        !isNativeButton &&
                        !isNativeLink) ||
                    (event.key === ' ' && !isNativeButton)

                if (disabled && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    return
                }

                if (shouldActivate) {
                    event.preventDefault()
                    event.currentTarget.click()
                }
            },
        }),
    }

    if (variant === DIVIDER || variant === HEADER) {
        return (
            <Component
                ref={menuitemRef}
                id={menuitemId}
                role={
                    roleProp ||
                    (variant === DIVIDER ? 'separator' : 'presentation')
                }
                aria-orientation={
                    variant === DIVIDER ? 'horizontal' : undefined
                }
                style={style}
                className={classNames(
                    `menu-item-${variant}`,
                    variant === DIVIDER &&
                        'border-b my-1 -mx-1',
                    variant === DIVIDER && dropdownClassNames?.separator,
                    variant === HEADER && dropdownClassNames?.label,
                    className,
                )}
                {...rest}
                data-variant={variant}
            >
                {variant === HEADER && children}
            </Component>
        )
    }

    if (variant === CUSTOM) {
        return (
            <Component
                ref={menuitemRef}
                id={menuitemId}
                role={roleProp || 'menuitem'}
                tabIndex={
                    tabIndexProp ??
                    (menu.activeIndex === item.index ? 0 : -1)
                }
                aria-disabled={disabled || undefined}
                style={style}
                className={classNames(
                    `menu-item-${variant}`,
                    !disabled &&
                        '[&:focus:not(:hover)]:bg-accent [&:focus:not(:hover)]:text-accent-foreground focus:outline-none',
                    dropdownClassNames?.customItem,
                    className,
                )}
                {...menuitemEventHandlers}
                {...rest}
                data-variant={variant}
            >
                {children}
            </Component>
        )
    }

    function renderChildren() {
        if (!isValidElement(children)) {
            return children
        }
        return cloneElement(children)
    }

    return (
        <DropdownItemElement
            ref={menuitemRef}
            asElement={Component}
            id={menuitemId}
            role={roleProp || 'menuitem'}
            tabIndex={
                tabIndexProp ??
                (menu.activeIndex === item.index ? 0 : -1)
            }
            aria-disabled={disabled || undefined}
            style={style}
            isActive={active}
            disabled={disabled}
            eventKey={eventKey}
            className={classNames(
                'font-medium px-3 rounded-control-sm text-popover-foreground',
                !disabled &&
                    !active &&
                    'hover:bg-accent hover:text-accent-foreground',
                active &&
                    'font-semibold bg-accent text-accent-foreground',
                disabled && 'cursor-not-allowed opacity-40',
                !disabled &&
                    '[&:focus:not(:hover)]:bg-accent [&:focus:not(:hover)]:text-accent-foreground focus:outline-none',
                dropdownClassNames?.item,
                className,
            )}
            {...menuitemEventHandlers}
            {...rest}
            data-disabled={disabled ? '' : undefined}
            data-state={active ? 'active' : undefined}
            data-variant={variant}
        >
            {dropdownClassNames?.itemLabel ? (
                <span className={dropdownClassNames.itemLabel}>
                    {renderChildren()}
                </span>
            ) : (
                renderChildren()
            )}
        </DropdownItemElement>
    )
}

export default DropdownItem
