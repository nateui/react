import { useState, useEffect, useContext } from 'react'
import { CollapseContextProvider } from './context/collapse-context'
import MenuItemIndicator from './menu-item-indicator'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { motion } from 'motion/react'
import MenuContext from './context/menu-context'
import { ChevronDown } from '../icons/index'
import type { ReactNode, MouseEvent, ComponentProps } from 'react'

export type MenuCollapseProps = ComponentProps<'li'> & {
    active?: boolean
    eventKey?: string
    expanded?: boolean
    hierarchyIndicator?: boolean
    indicatorClass?: string
    indent?: boolean
    label?: string | ReactNode
    onToggle?: (expanded: boolean, e: MouseEvent<HTMLDivElement>) => void
}

const MenuCollapse = (props: MenuCollapseProps) => {
    const {
        active,
        children,
        className,
        eventKey,
        expanded = false,
        indent = true,
        label = null,
        onToggle,
        hierarchyIndicator,
        indicatorClass,
        ...rest
    } = props

    const [isExpanded, setIsExpanded] = useState(expanded)
    const { classNames: configClassNames } = useConfig()
    const menuClassNames = configClassNames?.menu

    const {
        collapsed,
        defaultExpandedKeys,
        defaultCollapseActiveKeys,
        variant
    } = useContext(MenuContext)

    useEffect(() => {
        if ((defaultExpandedKeys as string[]).includes(eventKey as string)) {
            setIsExpanded(true)
        }
        if (expanded !== isExpanded) {
            setIsExpanded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, eventKey, defaultExpandedKeys])

    const toggleCollapse = (e: MouseEvent<HTMLDivElement>) => {
        if (typeof onToggle === 'function') {
            onToggle(!isExpanded, e)
        }
        setIsExpanded(!isExpanded)
    }

    const isActive = Boolean(
        defaultCollapseActiveKeys?.includes(eventKey as string) || active,
    )
    const activeClass = 'text-foreground hover:text-foreground'
    const hoverClass = classNames(
        'hover:text-foreground', 
        variant === 'default' ? 'hover:bg-accent' : 'hover:bg-accent-hover'
    )

    const menuCollapseItemClass = classNames(
        'menu-collapse-item cursor-pointer select-none font-medium px-2 h-9 rounded-control flex items-center justify-between transition-colors duration-200 ease-in-out text-accent-foreground inset-ring inset-ring-transparent',
        !isActive && hoverClass,
        isActive && 'menu-collapse-item-active',
        isActive && activeClass,
        hierarchyIndicator && 'group/menu-item',
        menuClassNames?.collapseTrigger,
        className,
    )

    return (
        <li
            className={classNames('menu-collapse group/menu-collapse', menuClassNames?.collapse)}
            {...rest}
            data-state={isExpanded ? 'open' : 'closed'}
        >
            <div
                className={menuCollapseItemClass}
                role="presentation"
                onClick={toggleCollapse}
            >
                <span
                    className={classNames(
                        'flex items-center gap-2',
                        menuClassNames?.collapseLabel,
                    )}
                >
                    {hierarchyIndicator && (
                        <MenuItemIndicator
                            isActive={isActive}
                            hoverable={!isActive}
                            className={classNames(indicatorClass,  menuClassNames?.itemIndicator)}
                        />
                    )}
                    {label}
                </span>
                <motion.span
                    initial={{ transform: 'rotate(0deg)' }}
                    animate={{
                        transform: isExpanded
                            ? 'rotate(-180deg)'
                            : 'rotate(0deg)',
                    }}
                    transition={{ duration: 0.15 }}
                    className={menuClassNames?.collapseIndicator}
                >
                    {collapsed ? null : <ChevronDown />}
                </motion.span>
            </div>
            <CollapseContextProvider value={isExpanded}>
                <motion.ul
                    className={classNames(
                        'menu-collapse-content',
                        indent ? 'menu-collapse-content-indent ltr:ml-4 rtl:mr-4' : '',
                        menuClassNames?.collapseContent,
                    )}
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {children}
                </motion.ul>
            </CollapseContextProvider>
        </li>
    )
}

MenuCollapse.displayName = 'MenuCollapse'

export default MenuCollapse
