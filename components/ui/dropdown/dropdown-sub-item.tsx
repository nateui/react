import { useContext, useId } from 'react'
import isNil from '@/utils/is-nil'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import DropdownContext from './context/dropdown-context'
import DropdownItemElement from './dropdown-item-element'
import { ChevronRight, ChevronLeft } from '../icons/index'
import type { SyntheticEvent, ElementType, Ref, ComponentProps } from 'react'

export interface DropdownSubItemSharedProps {
    onClick?: (e: SyntheticEvent) => void
    disabled?: boolean
    eventKey?: string
}

export type DropdownSubItemProps = ComponentProps<ElementType> & DropdownSubItemSharedProps & {
    asElement?: ElementType
    active?: boolean
    ref?: Ref<HTMLElement>
    onSelect?: (eventKey: string, e: MouseEvent) => void
}

const DropdownSubMenu = (props: DropdownSubItemProps) => {
    const {
        asElement: Component = 'li',
        children,
        active: activeProp,
        disabled,
        className,
        style,
        eventKey,
        onSelect,
        ref = null,
        ...rest
    } = props

    const { classNames: configClassNames, direction } = useConfig()
    const dropdownClassNames = configClassNames?.dropdown

    const dropdown = useContext(DropdownContext)

    const menuitemId = `menu-item-${useId()}`

    const active =
        activeProp ||
        (!isNil(dropdown?.activeKey) && dropdown?.activeKey === eventKey)

    return (
        <DropdownItemElement
            ref={ref}
            disabled={disabled}
            asElement={Component}
            id={menuitemId}
            role="menuitem"
            aria-disabled={disabled || undefined}
            isActive={active}
            eventKey={eventKey}
            className={classNames(
                'dropdown-submenu-item justify-between font-medium px-3 rounded-control-sm text-popover-foreground',
                !disabled &&
                    !active &&
                    'hover:bg-accent hover:text-accent-foreground',
                active &&
                    'font-semibold bg-accent text-accent-foreground',
                disabled && 'cursor-not-allowed opacity-40',
                !disabled &&
                    '[&:focus:not(:hover)]:bg-accent [&:focus:not(:hover)]:text-accent-foreground focus:outline-none',
                dropdownClassNames?.subTrigger,
                className,
            )}
            style={style}
            data-disabled={disabled ? '' : undefined}
            data-state={active ? 'active' : undefined}
            onSelect={onSelect}
            {...rest}
        >
            <span className={dropdownClassNames?.itemLabel}>{children}</span>
            {dropdownClassNames?.subIndicator ? (
                <span className={dropdownClassNames.subIndicator}>
                    {direction === 'rtl' ? (
                        <ChevronLeft />
                    ) : (
                        <ChevronRight />
                    )}
                </span>
            ) : direction === 'rtl' ? (
                <ChevronLeft />
            ) : (
                <ChevronRight />
            )}
        </DropdownItemElement>
    )
}

export default DropdownSubMenu
