import { useEffect } from 'react'
import classNames from '@/utils/class-names'
import { useTabs } from './context'
import { useConfig } from '../config-provider/index'
import type { TabsValue } from './context'
import type { ComponentPropsWithRef } from 'react'

export type TabContentProps = ComponentPropsWithRef<'div'> & {
    value: TabsValue
}

const TabContent = (props: TabContentProps) => {
    const {
        value,
        children,
        className,
        id: idProp,
        ref,
        'aria-labelledby': ariaLabelledByProp,
        ...rest
    } = props
    const { getPanelId, getTabId, registerPanelId, value: activeValue } =
        useTabs()
    const { classNames: configClassNames } = useConfig()
    const tabsClassNames = configClassNames?.tabs
    const isSelected = value === activeValue
    const panelId = idProp ?? getPanelId?.(value)
    const tabId = getTabId?.(value)

    useEffect(() => {
        if (idProp) {
            registerPanelId?.(value, idProp)
        }
    }, [idProp, registerPanelId, value])

    const tabContentClass = classNames(
        'tab-content',
        isSelected && 'tab-content-active',
        tabsClassNames?.content,
        className,
    )

    return (
        <div
            {...rest}
            ref={ref}
            id={panelId}
            role="tabpanel"
            aria-labelledby={ariaLabelledByProp ?? tabId}
            hidden={!isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={tabContentClass}
            data-state={isSelected ? 'active' : 'inactive'}
        >
            {isSelected && children}
        </div>
    )
}

export default TabContent
