import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { MenuContextProvider } from './context/menu-context'
import type { Ref, ComponentProps } from 'react'
import type { MenuVariant } from './context/menu-context'

export type MenuProps = ComponentProps<'ul'> & {
    defaultActiveKeys?: Array<string>
    defaultExpandedKeys?: Array<string>
    defaultCollapseActiveKeys?: Array<string>
    onSelect?: (eventKey: string, e: MouseEvent) => void
    ref?: Ref<HTMLUListElement>
    collapsed?: boolean
    variant?: MenuVariant
}

const Menu = (props: MenuProps) => {
    const {
        children,
        className,
        defaultActiveKeys = [],
        defaultExpandedKeys = [],
        defaultCollapseActiveKeys = [],
        onSelect,
        ref,
        collapsed = false,
        variant = 'default',
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const menuClassNames = configClassNames?.menu

    const menuClass = classNames(
        'menu',
        `menu-${variant}`,
        menuClassNames?.root,
        className,
    )

    return (
        <ul
            {...rest}
            ref={ref}
            className={menuClass}
            data-variant={variant}
        >
            <MenuContextProvider
                value={{
                    onSelect,
                    collapsed,
                    variant,
                    defaultExpandedKeys,
                    defaultActiveKeys,
                    defaultCollapseActiveKeys,
                }}
            >
                {children}
            </MenuContextProvider>
        </ul>
    )
}

export default Menu
