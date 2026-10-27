import { useState, useRef, useMemo, useEffect, useCallback, useId } from 'react'
import useMergedRef from '@/hooks/use-merge-ref'
import { mergeDescribedBy, useForm, useFormField } from '../form/context'
import { useConfig, CONTROL_SIZES } from '../config-provider/index'
import SelectItem from './select-item'
import SelectMenu from './select-menu'
import ListElement from './list-element'
import FilterInput from './filter-input'
import { ChevronDown, ChevronUp, Cross } from '../icons/index'
import Spinner from '../spinner'
import classNames from '@/utils/class-names'
import useSelectFloating from './hooks/use-select-floating'
import {
    useSelectState,
    useKeyboardNavigation,
    useClickOutside,
    useAccessibility,
} from './hooks/index'
import { flattenGroupOptions, useFilteredOptionsMulti } from './utils/index'
import type {
    BaseSelectProps,
    Option,
    SingleOption,
    GroupOption,
    SelectedOptions,
    FilterFunctionMulti,
} from './types'
import type { ReactNode } from 'react'

export type SelectMultiProps<ExtraOption = object> =
    BaseSelectProps<ExtraOption> & {
    customLabel?: (selectedItem: SingleOption<ExtraOption>) => ReactNode
    defaultValue?: SelectedOptions<ExtraOption>
    filter?: FilterFunctionMulti<ExtraOption>
    value?: SelectedOptions<ExtraOption>
    onChange?: (value: SelectedOptions<ExtraOption>) => void
    showClearAllButton?: boolean
}

const Multi = <ExtraOption,>(props: SelectMultiProps<ExtraOption>) => {
    const {
        customOption,
        customLabel,
        defaultValue,
        filter,
        id,
        'aria-describedby': ariaDescribedByProp,
        'aria-invalid': ariaInvalidProp,
        'aria-label': ariaLabelProp,
        'aria-labelledby': ariaLabelledByProp,
        invalid,
        isCreatable,
        isDisabled,
        isSearchable,
        isLoading,
        inputId,
        className,
        noOptionsMessage = 'No options',
        options = [],
        onChange,
        onInputChange,
        onMenuOpen,
        placeholder,
        size,
        showClearAllButton = true,
        value,
        placement,
        searchInputProps,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const selectClassNames = configClassNames?.select
    const formControlSize = useForm()?.size
    const formField = useFormField()
    const formFieldInvalid = formField?.invalid

    const selectSize = (size ??
        formControlSize ??
        componentDefaults?.select?.size ??
        'md') as keyof typeof CONTROL_SIZES

    const isSelectInvalid = invalid || formFieldInvalid
    const generatedControlId = useId()
    const controlId =
        inputId ?? formField?.controlId ?? `${generatedControlId}-control`
    const ariaDescribedBy = mergeDescribedBy(
        ariaDescribedByProp,
        formField?.describedBy,
    )
    const ariaLabelledBy =
        ariaLabelledByProp ?? (!ariaLabelProp ? formField?.labelId : undefined)

    const [filterValue, setFilterValue] = useState('')
    const [unControlledSelectedItems, setUnControlledSelectedItems] = useState<
        SelectedOptions<ExtraOption>
    >(defaultValue || [])
    const [isCreating, setIsCreating] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedItems = (() => {
        if (typeof value !== 'undefined') {
            return value
        }
        return unControlledSelectedItems
    })()

    const isSingle = options.some(
        (option: Option<ExtraOption>) => 'value' in option,
    )

    // Use filtered options based on filter value
    const filteredOptions = useFilteredOptionsMulti(
        options,
        filterValue,
        selectedItems,
        filter,
    )

    // Handle creatable options
    const finalOptions = useMemo(() => {
        if (
            isCreatable &&
            filterValue.length > 0 &&
            filteredOptions.length === 0
        ) {
            setIsCreating(true)
            return [
                { label: filterValue, value: filterValue },
            ] as SingleOption<ExtraOption>[]
        }
        if (isCreating && filteredOptions.length > 0) {
            setIsCreating(false)
        }
        return filteredOptions
    }, [filteredOptions, isCreatable, filterValue, isCreating])

    const flattenedOptions = isSingle
        ? finalOptions
        : flattenGroupOptions(finalOptions as Array<GroupOption<ExtraOption>>)

    const handleChange = useCallback(
        (newSelectedItems: SelectedOptions<ExtraOption> = []) => {
            onChange?.(newSelectedItems)
            if (typeof value === 'undefined') {
                setUnControlledSelectedItems(newSelectedItems)
            }
        },
        [onChange, value],
    )

    // Custom multi-select item handler
    const handleMultiSelectItem = useCallback(
        (item: SingleOption<ExtraOption>) => {
            const existingIndex = selectedItems.findIndex(
                (selectedItem) => selectedItem.value === item.value,
            )

            let newSelectedItems: SelectedOptions<ExtraOption>
            if (existingIndex >= 0) {
                // Item already selected, remove it
                newSelectedItems = selectedItems.filter(
                    (_, index) => index !== existingIndex,
                )
            } else {
                // Add new item
                newSelectedItems = [...selectedItems, item]
            }

            handleChange(newSelectedItems)

            if (isCreating && isCreatable) {
                setIsCreating(false)
            }
            setFilterValue('')
        },
        [selectedItems, handleChange, isCreating, isCreatable],
    )

    // Custom state management for multi-select
    const selectState = useSelectState({
        items: flattenedOptions as SingleOption<ExtraOption>[],
        isMulti: true,
        selectedItems: selectedItems,
        onSelectedItemsChange: handleChange,
        defaultHighlightedIndex: 0,
    })

    // Override selectItem to use multi-select logic
    const customSelectItem = useCallback(
        (item: SingleOption<ExtraOption>) => {
            handleMultiSelectItem(item)
            // Keep menu open for multi-select
            if (!selectState.isOpen) {
                selectState.openMenu()
            }
        },
        [handleMultiSelectItem, selectState],
    )

    // Custom keyboard navigation for multi-select
    const keyboardHandlers = useKeyboardNavigation({
        items: flattenedOptions as SingleOption<ExtraOption>[],
        isOpen: selectState.isOpen,
        highlightedIndex: selectState.highlightedIndex,
        setHighlightedIndex: selectState.setHighlightedIndex,
        selectItem: customSelectItem,
        closeMenu: selectState.closeMenu,
        openMenu: selectState.openMenu,
        toggleMenu: selectState.toggleMenu,
        isMulti: true,
        isDisabled,
    })

    // Click outside to close menu
    useClickOutside({
        ref: containerRef,
        onClickOutside: selectState.closeMenu,
        enabled: selectState.isOpen && !isDisabled,
    })

    // Accessibility features for multi-select
    const accessibility = useAccessibility({
        isOpen: selectState.isOpen,
        highlightedIndex: selectState.highlightedIndex,
        selectedItems: selectedItems,
        isMulti: true,
        inputId: controlId,
        labelId: ariaLabelledBy,
        isDisabled,
        items: flattenedOptions as SingleOption<ExtraOption>[],
    })

    // Remove selected item function
    const removeSelectedItem = useCallback(
        (item: SingleOption<ExtraOption>) => {
            const newSelectedItems = selectedItems.filter(
                (selectedItem) => selectedItem.value !== item.value,
            )
            handleChange(newSelectedItems)
        },
        [selectedItems, handleChange],
    )

    // Handle filter input changes
    const handleFilterChange = useCallback(
        (newFilterValue: string) => {
            setFilterValue(newFilterValue)
            onInputChange?.(newFilterValue)
            // Reset highlighted index when filter changes
            if (flattenedOptions.length > 0) {
                selectState.setHighlightedIndex(0)
            }
        },
        [onInputChange, flattenedOptions.length, selectState],
    )

    useEffect(() => {
        if (onMenuOpen && selectState.isOpen) {
            onMenuOpen()
        }
    }, [selectState.isOpen, onMenuOpen])

    // Clear filter when menu closes
    useEffect(() => {
        if (!selectState.isOpen) {
            setFilterValue('')
            setIsCreating(false)
        }
    }, [selectState.isOpen])

    const { isMounted, mergedStyles, refs } = useSelectFloating({
        isOpen: selectState.isOpen,
        placement,
        offsetValue: 5,
    })

    const inputMergeRef = useMergedRef(refs.setReference, inputRef)

    // Custom item click handler for multi-select
    const handleItemClick = useCallback(
        (item: SingleOption<ExtraOption>) => {
            const wasSelected = selectedItems.some(
                (selected) => selected.value === item.value,
            )
            customSelectItem(item)

            if (wasSelected) {
                accessibility.handleOptionDeselect(item)
            } else {
                accessibility.handleOptionSelect(item)
            }
        },
        [customSelectItem, selectedItems, accessibility],
    )

    // Custom item interaction props for multi-select
    const getItemProps = useCallback(
        (item: SingleOption<ExtraOption>, index: number) => ({
            onClick: () => handleItemClick(item),
            onMouseMove: () => {
                if (selectState.highlightedIndex !== index) {
                    selectState.setHighlightedIndex(index)
                }
            },
            onKeyDown: keyboardHandlers.handleItemKeyDown,
            ...accessibility.accessibilityProps.getOptionProps(index, item),
        }),
        [handleItemClick, selectState, keyboardHandlers, accessibility],
    )

    // Custom trigger button props for multi-select
    const getTriggerProps = useCallback(
        () => ({
            onClick: () => {
                if (selectState.isOpen) {
                    selectState.closeMenu()
                    accessibility.handleMenuClose()
                } else {
                    selectState.openMenu()
                    accessibility.handleMenuOpen()
                }
            },
            onKeyDown: keyboardHandlers.handleTriggerKeyDown,
            type: 'button' as const,
            disabled: isDisabled,
            ...accessibility.accessibilityProps.triggerProps,
            ...(ariaLabelProp !== undefined || ariaLabelledBy !== undefined
                ? { 'aria-label': ariaLabelProp }
                : {}),
        }),
        [
            accessibility,
            ariaLabelProp,
            ariaLabelledBy,
            isDisabled,
            keyboardHandlers,
            selectState,
        ],
    )

    // Custom menu props for multi-select
    const getMenuProps = useCallback(
        () => ({
            onKeyDown: keyboardHandlers.handleMenuKeyDown,
            ...accessibility.accessibilityProps.menuProps,
        }),
        [keyboardHandlers, accessibility],
    )

    const renderMenuList = () => {
        if (isCreatable && isCreating) {
            const createItem = {
                label: filterValue,
                value: filterValue,
            } as SingleOption<ExtraOption>
            return (
                <li
                    className={classNames(
                        'select-item select-item-create  px-3 py-2 rounded-control-sm flex justify-center items-center cursor-auto text-popover-foreground font-medium',
                        selectState.highlightedIndex === 0 &&
                            'select-item-hovered bg-accent text-accent-foreground',
                        selectClassNames?.item,
                    )}
                    {...getItemProps(createItem, 0)}
                >
                    Create {`"${filterValue}"`}
                </li>
            )
        }

        if (finalOptions.length === 0 && !isCreatable) {
            if (typeof noOptionsMessage === 'function') {
                return noOptionsMessage(ListElement)
            }

            return (
                <li
                    className={classNames(
                        'select-item select-item-message px-3 py-2 rounded-control-sm flex justify-center items-center cursor-auto text-popover-foreground font-medium',
                        selectClassNames?.message,
                    )}
                >
                    {noOptionsMessage}
                </li>
            )
        }

        return isSingle
            ? (finalOptions as Array<SingleOption<ExtraOption>>).map(
                  (item, index) => (
                      <SelectItem
                          key={item.value}
                          option={item}
                          selected={selectedItems.some(
                              (selected) => selected.value === item.value,
                          )}
                          hovered={selectState.highlightedIndex === index}
                          customOption={customOption}
                          {...getItemProps(item, index)}
                      />
                  ),
              )
            : (finalOptions as Array<GroupOption<ExtraOption>>).reduce(
                  (
                      results: {
                          sections: ReactNode[]
                          itemIndex: number
                      },
                      section,
                      sectionIndex,
                  ) => {
                      results.sections.push(
                          <li
                              className={classNames(
                                  'select-item-group',
                                  selectClassNames?.group,
                              )}
                              key={sectionIndex}
                          >
                              <p
                                  className={classNames(
                                      'select-item-group-label',
                                      selectClassNames?.groupLabel,
                                  )}
                              >
                                  {section.label}
                              </p>
                              <ul>
                                  {section.options.map(
                                      (option, optionIndex) => {
                                          const resultIndex =
                                              results.itemIndex++
                                          return (
                                              <SelectItem
                                                  key={optionIndex}
                                                  option={option}
                                                  selected={selectedItems.some(
                                                      (selected) =>
                                                          selected.value ===
                                                          option.value,
                                                  )}
                                                  hovered={
                                                      selectState.highlightedIndex ===
                                                      resultIndex
                                                  }
                                                  customOption={customOption}
                                                  {...getItemProps(
                                                      option,
                                                      resultIndex,
                                                  )}
                                              />
                                          )
                                      },
                                  )}
                              </ul>
                          </li>,
                      )

                      return results
                  },
                  { sections: [], itemIndex: 0 },
              ).sections
    }

    return (
        <div
            id={id}
            onClick={() => {
                if (!selectState.isOpen && !isDisabled) {
                    selectState.openMenu()
                    inputRef.current?.focus()
                }
            }}
            className={classNames(
                'select select-multi group/select',
                `select-${selectSize}`,
                'relative border border-control-border bg-control rounded-control shadow-control transition duration-150',
                isSelectInvalid &&
                    'select-invalid border-destructive bg-destructive-soft',
                isDisabled &&
                    'select-disabled bg-control-disabled text-control-disabled-foreground',
                selectState.isOpen &&
                    'select-menu-open border-control-focus ring ring-control-focus',
                selectState.isOpen &&
                    isSelectInvalid &&
                    'ring-destructive bg-transparent',
                selectClassNames?.root,
                className,
            )}
            data-disabled={isDisabled ? '' : undefined}
            data-invalid={isSelectInvalid ? '' : undefined}
            data-state={selectState.isOpen ? 'open' : 'closed'}
            ref={(node) => {
                containerRef.current = node
                refs.setReference(node)
            }}
            onKeyDown={keyboardHandlers.handleContainerKeyDown}
            {...rest}
        >
            <div
                className={classNames(
                    'select-control flex flex-1 items-center justify-between h-full',
                    CONTROL_SIZES[selectSize].minH,
                    selectClassNames?.control,
                )}
            >
                <div
                    className={classNames(
                        'select-display-wrapper h-full w-full flex items-center outline-none',
                        selectClassNames?.trigger,
                    )}
                >
                    <div
                        className={classNames(
                            'select-tag-wrapper flex items-center gap-1 flex-wrap',
                            CONTROL_SIZES[selectSize].h,
                            selectedItems.length > 0 && 'has-value px-1.5',
                            selectClassNames?.value,
                        )}
                    >
                        {selectedItems.map(
                            function renderSelectedItem(
                                selectedItemForRender,
                                index,
                            ) {
                                return (
                                    <span
                                        className={classNames(
                                            'select-tag bg-tag border-tag rounded-tag text-foreground text-xs font-semibold inline-flex gap-1 px-1 py-0.75 min-w-0',
                                            isDisabled &&
                                                'select-tag-disabled opacity-60 cursor-not-allowed',
                                            selectClassNames?.tag,
                                        )}
                                        key={`selecte-tag-${index}`}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Backspace' ||
                                                e.key === 'Delete'
                                            ) {
                                                e.preventDefault()
                                                removeSelectedItem(
                                                    selectedItemForRender,
                                                )
                                                accessibility.handleOptionDeselect(
                                                    selectedItemForRender,
                                                )
                                            }
                                        }}
                                        {...accessibility.accessibilityProps.getSelectedItemProps(
                                            index,
                                            selectedItemForRender,
                                        )}
                                        tabIndex={isDisabled ? -1 : 0}
                                    >
                                        {customLabel
                                            ? customLabel(selectedItemForRender)
                                            : selectedItemForRender.label}
                                        {showClearAllButton && (
                                            <button
                                                type="button"
                                                className={classNames(
                                                    'selecte-tag-remove cursor-pointer disabled:cursor-not-allowed',
                                                    selectClassNames?.tagRemove,
                                                )}
                                                onClick={(e) => {
                                                    if (isDisabled) {
                                                        return
                                                    }
                                                    e.stopPropagation()
                                                    removeSelectedItem(
                                                        selectedItemForRender,
                                                    )
                                                    accessibility.handleOptionDeselect(
                                                        selectedItemForRender,
                                                    )
                                                }}
                                                disabled={isDisabled}
                                                aria-label={`Remove ${selectedItemForRender.label}`}
                                            >
                                                <Cross className="text-xs" />
                                            </button>
                                        )}
                                    </span>
                                )
                            },
                        )}
                        <div className="select-input-wrapper visible flex-1 inline-flex cursor-default">
                            <input
                                placeholder={
                                    selectedItems.length > 0 ? '' : placeholder
                                }
                                className={classNames(
                                    'select-multi-input ring-0 outline-0 h-full w-full cursor-default disabled:cursor-not-allowed',
                                    selectedItems.length === 0 && 'px-3',
                                    selectedItems.length > 0 && 'has-value',
                                    selectClassNames?.multiInput,
                                )}
                                readOnly
                                value=""
                                onKeyDown={
                                    keyboardHandlers.handleTriggerKeyDown
                                }
                                onClick={() => {
                                    if (!selectState.isOpen && !isDisabled) {
                                        selectState.openMenu()
                                    }
                                }}
                                ref={inputMergeRef}
                                id={controlId}
                                disabled={isDisabled}
                                {...(ariaDescribedBy !== undefined
                                    ? {
                                          'aria-describedby': ariaDescribedBy,
                                      }
                                    : {})}
                                {...(
                                    isSelectInvalid ||
                                    ariaInvalidProp !== undefined
                                        ? {
                                              'aria-invalid': isSelectInvalid
                                                  ? true
                                                  : ariaInvalidProp,
                                          }
                                        : {}
                                )}
                                aria-label={ariaLabelProp}
                                aria-labelledby={ariaLabelledBy}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={classNames(
                        'select-indicator-wrapper flex items-center gap-1 h-full',
                        selectClassNames?.indicator,
                    )}
                >
                    {selectedItems.length > 0 && !isDisabled && (
                        <button
                            onClick={(e) => {
                                if (isDisabled) {
                                    return
                                }
                                e.stopPropagation()
                                handleChange([])
                            }}
                            type="button"
                            className={classNames(
                                'select-clear-button disabled:cursor-not-allowed',
                                selectClassNames?.clearButton,
                            )}
                            disabled={isDisabled}
                        >
                            <Cross height="1.25em" width="1.25em" />
                        </button>
                    )}
                    {isLoading && (
                        <Spinner
                            size={16}
                            className={classNames(
                                'select-spinner',
                                selectClassNames?.spinner,
                            )}
                        />
                    )}
                    <button
                        aria-label="select indicator"
                        className={classNames(
                            'select-indicator px-3 h-full disabled:cursor-not-allowed',
                            selectClassNames?.indicator,
                        )}
                        {...getTriggerProps()}
                        type="button"
                    >
                        {selectState.isOpen ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
            </div>
            <SelectMenu
                {...getMenuProps()}
                ref={refs.setFloating}
                style={mergedStyles}
                isOpen={isMounted}
            >
                {isSearchable && (
                    <FilterInput
                        value={filterValue}
                        onValueChange={handleFilterChange}
                        onKeyDown={keyboardHandlers.handleFilterKeyDown}
                        placeholder="Search options..."
                        disabled={isDisabled}
                        {...searchInputProps}
                        {...accessibility.accessibilityProps.filterInputProps}
                    />
                )}
                <div
                    className={classNames(
                        'select-menu-content overflow-y-auto max-h-[250px] p-1',
                        selectClassNames?.menuContent,
                    )}
                >
                    {renderMenuList()}
                </div>
            </SelectMenu>
        </div>
    )
}

export default Multi
