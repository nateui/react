import { useContext } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { GroupContextProvider } from './context/group-context'
import MenuContext from './context/menu-context'
import type { ReactNode, ComponentProps } from 'react'

export type MenuGroupProps = ComponentProps<'div'> & {
    label: string | ReactNode
}

const MenuGroup = (props: MenuGroupProps) => {
    const { label, children, className, ...rest } = props

    const { collapsed } = useContext(MenuContext)
    const { classNames: configClassNames } = useConfig()
    const menuClassNames = configClassNames?.menu

    const menuGroupDefaultClass = 'menu-group'
    const menuGroupClass = classNames(
        menuGroupDefaultClass,
        menuClassNames?.group,
        className,
    )

    return (
        <div className={menuGroupClass} {...rest}>
            {label && (
                <div
                    className={classNames(
                        'menu-title uppercase font-medium text-xs px-2 mt-4 mb-2 ',
                        menuClassNames?.groupLabel,
                    )}
                >
                    {collapsed ? <span className="flex items-center h-1">
                        <span className="h-0.5 bg-muted-foreground/30 w-full" />
                    </span> : label}
                </div>
            )}
            <GroupContextProvider value={null}>
                <ul className={menuClassNames?.groupList}>{children}</ul>
            </GroupContextProvider>
        </div>
    )
}

export default MenuGroup
