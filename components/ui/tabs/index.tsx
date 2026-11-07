import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Tabs from './tabs'
import type { TabsProps } from './tabs'
import TabList from './tab-list'
import TabNav from './tab-nav'
import TabContent from './tab-content'

export type { TabsProps } from './tabs'
export type { TabListProps } from './tab-list'
export type { TabNavProps } from './tab-nav'
export type { TabContentProps } from './tab-content'

type CompoundedComponent = ForwardRefExoticComponent<
    TabsProps & RefAttributes<HTMLDivElement>
> & {
    TabList: typeof TabList
    TabNav: typeof TabNav
    TabContent: typeof TabContent
}

const Tabs = _Tabs as CompoundedComponent

Tabs.TabList = TabList
Tabs.TabNav = TabNav
Tabs.TabContent = TabContent

export { Tabs }

export default Tabs
