import { Check } from '../icons/index'
import ListElement from './list-element'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { BaseSelectItemProps, SingleOption, CustomOption } from './types'

type SelectItemProps<T> = {
    id?: string
    customOption?: CustomOption<T>
} & BaseSelectItemProps<T>

const SelectItem = <T,>(props: SelectItemProps<T>) => {
    const {
        hovered = false,
        selected = false,
        option,
        customOption,
        onClick,
        onMouseDown,
        onMouseMove,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const selectClassNames = configClassNames?.select

    const disabled = 'disabled' in option && option?.disabled

    const actionEvents = disabled
        ? {}
        : {
              onClick,
              onMouseDown,
              onMouseMove,
          }

    return (
        <ListElement
            className={classNames(
                'group/select-item',
                hovered && 'select-item-hovered',
                hovered && 'bg-accent text-accent-foreground',
                selected &&
                    'select-item-selected font-semibold text-foreground',
                disabled && 'select-item-disabled cursor-not-allowed opacity-40',
                selectClassNames?.item,
            )}
            data-disabled={disabled ? '' : undefined}
            data-state={selected ? 'selected' : undefined}
            {...actionEvents}
            {...rest}
        >
            {customOption ? (
                customOption({
                    option: option as SingleOption<T>,
                    hovered,
                    selected,
                    CheckIcon: <Check height="1.25em" width="1.25em" />,
                })
            ) : (
                <>
                    {selectClassNames?.itemText ? (
                        <span className={selectClassNames.itemText}>
                            {option.label}
                        </span>
                    ) : (
                        option.label
                    )}
                    {selected && (
                        <Check className={selectClassNames?.itemIndicator} />
                    )}
                </>
            )}
        </ListElement>
    )
}

export default SelectItem
