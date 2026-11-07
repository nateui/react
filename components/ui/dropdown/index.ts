import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Dropdown from './dropdown'
import type { DropdownProps } from './dropdown'
import DropdownItem from './dropdown-item'
import DropdownSub from './dropdown-sub'
import DropdownContextMenu from './dropdown-context-menu'
import type { DropdownRef } from './dropdown'

export type {
    DropdownProps,
    DropdownRef,
} from './dropdown'
export type { DropdownItemProps } from './dropdown-item'
export type { DropdownSubProps as DropdownMenuProps } from './dropdown-sub'
export type {
    DropdownContextMenuProps,
    DropdownContextMenuRef,
} from './dropdown-context-menu'

type CompoundedComponent = ForwardRefExoticComponent<
    DropdownProps & RefAttributes<DropdownRef>
> & {
    Item: typeof DropdownItem
    Menu: typeof DropdownSub
    ContextMenu: typeof DropdownContextMenu
}

const Dropdown = _Dropdown as CompoundedComponent

Dropdown.Item = DropdownItem
Dropdown.Menu = DropdownSub
Dropdown.ContextMenu = DropdownContextMenu

export { Dropdown }

export default Dropdown
