import classNames from '@/utils/class-names'
import type { ComponentProps, ElementType, Ref } from 'react'

export type DropdownItemElementProps = ComponentProps<ElementType> & {
    asElement?: ElementType
    disabled?: boolean
    eventKey?: string
    isActive?: boolean
    onSelect?: (eventKey: string, e: MouseEvent) => void
    ref?: Ref<HTMLElement>
}

const DropdownItemElement = (props: DropdownItemElementProps) => {
    const {
        asElement: Component = 'div',
        children,
        className,
        disabled,
        eventKey,
        isActive,
        onSelect,
        onClick,
        ref,
        ...rest
    } = props

    const dropdownItemClass = classNames(
        'dropdown-item group/dropdown-item cursor-pointer font-medium px-2 rounded-control flex items-center w-full whitespace-nowrap gap-x-2 transition-colors duration-150 ease-in-out relative h-9',
        isActive && 'dropdown-item-active',
        disabled && 'dropdown-item-disabled cursor-not-allowed opacity-60',
        !disabled && 'dropdown-item-hoverable',
        className,
    )

    const handleOnClick = (e: MouseEvent) => {
        onClick?.(e as never)
        if (onSelect) {
            onSelect(eventKey as string, e)
        }
    }

    return (
        <Component
            ref={ref}
            className={dropdownItemClass}
            {...rest}
            data-disabled={disabled ? '' : undefined}
            data-state={isActive ? 'active' : undefined}
            onClick={handleOnClick}
        >
            {children}
        </Component>
    )
}

export default DropdownItemElement
