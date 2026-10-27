import { useCallback, useId, useRef, useState } from 'react'
import { TabsContextProvider } from './context'
import useControllableState from '@/hooks/use-controllable-state'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type {
    TabsActivationMode,
    TabsOrientation,
    TabsVariant,
    TabsValue,
} from './context'
import type { ComponentPropsWithRef } from 'react'

export type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'onChange'> & {
    activationMode?: TabsActivationMode
    defaultValue?: TabsValue
    onChange?: (tabValue: TabsValue) => void
    orientation?: TabsOrientation
    value?: TabsValue
    variant?: TabsVariant
}

const Tabs = (props: TabsProps) => {
    const {
        activationMode = 'automatic',
        className,
        defaultValue,
        onChange,
        orientation = 'horizontal',
        ref,
        value: valueProp,
        variant: variantProp,
        ...rest
    } = props
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const variant = variantProp ?? componentDefaults?.tabs?.variant ?? 'underline'
    const tabsClassNames = configClassNames?.tabs
    const [value, setValue] = useControllableState({
        prop: valueProp,
        onChange,
        defaultProp: defaultValue,
    })
    const baseId = useId()
    const tabIdsRef = useRef(new Map<TabsValue, string>())
    const panelIdsRef = useRef(new Map<TabsValue, string>())
    const [, setIdVersion] = useState(0)

    const getDefaultId = useCallback(
        (kind: 'tab' | 'panel', tabValue: TabsValue) =>
            `${baseId}-${kind}-${encodeURIComponent(tabValue)}`,
        [baseId],
    )
    const getTabId = useCallback(
        (tabValue: TabsValue) =>
            tabIdsRef.current.get(tabValue) ?? getDefaultId('tab', tabValue),
        [getDefaultId],
    )
    const getPanelId = useCallback(
        (tabValue: TabsValue) =>
            panelIdsRef.current.get(tabValue) ??
            getDefaultId('panel', tabValue),
        [getDefaultId],
    )
    const registerId = useCallback(
        (
            map: Map<TabsValue, string>,
            tabValue: TabsValue,
            id: string,
        ) => {
            if (map.get(tabValue) !== id) {
                map.set(tabValue, id)
                setIdVersion((current) => current + 1)
            }
        },
        [],
    )
    const registerTabId = useCallback(
        (tabValue: TabsValue, id: string) =>
            registerId(tabIdsRef.current, tabValue, id),
        [registerId],
    )
    const registerPanelId = useCallback(
        (tabValue: TabsValue, id: string) =>
            registerId(panelIdsRef.current, tabValue, id),
        [registerId],
    )

    const tabsClass = classNames('tabs group/tabs', tabsClassNames?.root, className)

    return (
        <TabsContextProvider
            value={{
                activationMode,
                getPanelId,
                getTabId,
                onValueChange: setValue,
                orientation,
                registerPanelId,
                registerTabId,
                value,
                variant,
            }}
        >
            <div
                className={tabsClass}
                {...rest}
                data-variant={variant}
                data-orientation={orientation}
                ref={ref}
            />
        </TabsContextProvider>
    )
}

export default Tabs
