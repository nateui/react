import { useContext } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import MenuContext from './context/menu-context'
import BaseMenuItem from './menu-item-element'
import type { MenuItemElementProps as BaseMenuItemProps } from './menu-item-element'

export type MenuItemProps = BaseMenuItemProps

const MenuItem = (props: MenuItemProps) => {
    const {
        className,
        disabled,
        eventKey,
        hierarchyIndicator,
        isActive: isActiveProp,
        ...rest
    } = props

    const {
        defaultActiveKeys = [],
        onSelect,
        variant = 'default'
    } = useContext(MenuContext)
    const { classNames: configClassNames } = useConfig()
    const menuClassNames = configClassNames?.menu

    const isActive =
        isActiveProp ?? defaultActiveKeys.includes(eventKey as string)
    const activeClass = variant === 'default' ? 'bg-accent' : `bg-accent-hover`

    const menuItemClass = classNames(
        'text-accent-foreground inset-ring inset-ring-transparent',
        !disabled &&
            !isActive &&
            'hover:text-foreground hover:bg-accent',
        isActive && 'text-foreground hover:text-foreground',
        isActive && activeClass,
        'group/menu-item',
        menuClassNames?.item,
        className,
    )

    return (
        <BaseMenuItem
            asElement="li"
            disabled={disabled}
            eventKey={eventKey}
            hierarchyIndicator={hierarchyIndicator}
            indicatorClassName={menuClassNames?.itemIndicator}
            isActive={isActive}
            onSelect={onSelect}
            className={menuItemClass}
            {...rest}
        />
    )
}

MenuItem.displayName = 'MenuItem'

export default MenuItem
