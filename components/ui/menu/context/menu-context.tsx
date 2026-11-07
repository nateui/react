import { createContext } from 'react'

export type MenuVariant = 'default' | 'subtle'

export interface MenuContextProps {
    defaultActiveKeys?: Array<string>
    defaultExpandedKeys?: Array<string>
    defaultCollapseActiveKeys?: Array<string>
    onSelect?: (eventKey: string, e: MouseEvent) => void
    collapsed?: boolean
    variant?: MenuVariant
}

const MenuContext = createContext<MenuContextProps>({})

export const MenuContextProvider = MenuContext.Provider

export const MenuContextConsumer = MenuContext.Consumer

export default MenuContext
