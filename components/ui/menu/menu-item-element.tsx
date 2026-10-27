import MenuItemIndicator from './menu-item-indicator'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ElementType, Ref, ComponentProps } from 'react'

export type MenuItemElementProps = ComponentProps<ElementType> & {
    asElement?: ElementType
    id?: string
    disabled?: boolean
    hierarchyIndicator?: boolean
    indicatorClassName?: string
    indicatorLineClassName?: string
    eventKey?: string
    isActive?: boolean
    onSelect?: (eventKey: string, e: MouseEvent) => void
    ref?: Ref<HTMLElement>
}

const MenuItemElement = (props: MenuItemElementProps) => {
    const {
        asElement: Component = 'div',
        children,
        className,
        disabled,
        hierarchyIndicator,
        indicatorClassName,
        indicatorLineClassName,
        eventKey,
        isActive,
        onSelect,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const menuItemClassNames = configClassNames?.menuItem

    const menuItemActiveClass = `menu-item-active`
    const menuItemHoverClass = `menu-item-hoverable`
    const disabledClass = 'menu-item-disabled'
    const menuItemClass = classNames(
        'menu-item cursor-pointer font-medium px-2 rounded-control flex items-center w-full whitespace-nowrap gap-x-2 transition-colors duration-150 ease-in-out relative h-9',
        isActive && menuItemActiveClass,
        disabled && `${disabledClass} cursor-not-allowed opacity-60`,
        !disabled && menuItemHoverClass,
        hierarchyIndicator && 'items-center gap-2',
        menuItemClassNames?.root,
        className,
    )

    const hanldeOnClick = (e: MouseEvent) => {
        if (onSelect) {
            onSelect(eventKey as string, e)
        }
    }

    const indicator = (
        <MenuItemIndicator
            isActive={isActive}
            hoverable={!isActive && !disabled}
            className={indicatorClassName}
            lineClassName={indicatorLineClassName}
        />
    )

    return (
        <Component
            ref={ref}
            className={menuItemClass}
            {...rest}
            data-disabled={disabled ? '' : undefined}
            data-state={isActive ? 'active' : undefined}
            onClick={hanldeOnClick}
        >
            {hierarchyIndicator ? (
                <>
                    {indicator}
                    {children}
                </>
            ) : (
                <>{children}</>
            )}
        </Component>
    )
}

export default MenuItemElement
