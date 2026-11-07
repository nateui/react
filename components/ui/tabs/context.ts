import { createContext, useContext } from 'react'

export type TabsVariant = 'underline' | 'pill'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'automatic' | 'manual'
export type TabsValue = string

type TabsContextProps = {
    activationMode?: TabsActivationMode
    getPanelId?: (tabValue: TabsValue) => string
    getTabId?: (tabValue: TabsValue) => string
    onValueChange?: (tabValue: string) => void
    orientation?: TabsOrientation
    registerPanelId?: (tabValue: TabsValue, id: string) => void
    registerTabId?: (tabValue: TabsValue, id: string) => void
    value?: TabsValue
    variant?: TabsVariant
}

const TabsContext = createContext<TabsContextProps>({})

export const TabsContextProvider = TabsContext.Provider
export const TabsContextConsumer = TabsContext.Consumer

export function useTabs() {
    return useContext(TabsContext)
}

export default TabsContext
