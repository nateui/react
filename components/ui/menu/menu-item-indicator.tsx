import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'

type MenuItemIndicatorProps = {
    isActive?: boolean
    hoverable?: boolean
    className?: string
    lineClassName?: string
}

const MenuItemIndicator = ({
    isActive,
    hoverable,
    className,
    lineClassName,
}: MenuItemIndicatorProps) => {
    const { classNames: configClassNames } = useConfig()
    const menuItemClassNames = configClassNames?.menuItem

    return (
        <div
            className={classNames(
                'menu-hierarchy-indicator ltr:pl-5 rtl:pr-5 h-full relative flex justify-center items-center transition-all duration-150 h-9',
                menuItemClassNames?.indicator,
                className,
            )}
        >
            <div
                className={classNames(
                    'menu-hierarchy-indicator-line w-[2px] h-full bg-border',
                    hoverable &&
                        'group-hover/menu-item:bg-muted-foreground/40 group-hover/menu-item:h-[70%]',
                    isActive && 'active bg-primary h-[70%]',
                    lineClassName,
                )}
            />
        </div>
    )
}

export default MenuItemIndicator
