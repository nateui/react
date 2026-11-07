import { memo } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ComponentPropsWithRef, KeyboardEvent } from 'react'

export type FilterInputProps = Omit<ComponentPropsWithRef<'input'>, | 'value' | 'onKeyDown'> & {
    value: string
    onValueChange: (value: string) => void
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
}

const FilterInput =
    (
        {
            value,
            onValueChange,
            placeholder = 'Search...',
            onKeyDown,
            className,
            disabled,
            role = 'searchbox',
            'aria-label': ariaLabel = 'Filter options',
            'aria-autocomplete': ariaAutocomplete = 'list',
            'aria-expanded': ariaExpanded,
            'aria-owns': ariaOwns,
            'aria-activedescendant': ariaActiveDescendant,
            ref,
            ...rest
        }: FilterInputProps
) => {
    const { classNames: configClassNames } = useConfig()
    const selectClassNames = configClassNames?.select

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div
            className={classNames(
                'select-filter-wrapper p-2 border-b flex items-center gap-2',
                selectClassNames?.filter,
            )}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className={classNames(
                    'select-filter-input w-full px-2 outline-none text-popover-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                    selectClassNames?.filterInput,
                    className,
                )}
                disabled={disabled}
                autoFocus
                role={role}
                aria-label={ariaLabel}
                aria-autocomplete={ariaAutocomplete}
                aria-expanded={ariaExpanded}
                aria-owns={ariaOwns}
                aria-activedescendant={ariaActiveDescendant}
                onClick={handleClick}
                {...rest}
            />
        </div>
    )
}



export default memo(FilterInput)
