import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Menu from './menu'
import type { MenuProps } from './menu'
import MenuItem from './menu-item'
import MenuCollapse from './menu-collapse'
import MenuGroup from './menu-group'

export type { MenuProps } from './menu'
export type { MenuCollapseProps } from './menu-collapse'
export type { MenuGroupProps } from './menu-group'
export type { MenuItemProps } from './menu-item'

type CompoundedComponent = ForwardRefExoticComponent<
    MenuProps & RefAttributes<HTMLElement>
> & {
    MenuItem: typeof MenuItem
    MenuCollapse: typeof MenuCollapse
    MenuGroup: typeof MenuGroup
}

const Menu = _Menu as CompoundedComponent

Menu.MenuItem = MenuItem
Menu.MenuCollapse = MenuCollapse
Menu.MenuGroup = MenuGroup

export { Menu }

export default Menu
