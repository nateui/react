import { useState, useRef, useEffect, useCallback, useMemo, useId } from 'react'
import { Cross } from './icons/index'
import Tag from './tag'
import Popover from './popover/index'
import classNames from '@/utils/class-names'
import { useConfig, CONTROL_SIZES } from './config-provider/index'
import { mergeDescribedBy, useForm, useFormField } from './form/context'
import useControllableState from '@/hooks/use-controllable-state'
import type { HTMLAttributes } from 'react'
import type { TypeAttributes } from './config-provider/types'

export type MultiValueInputProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
> & {
    value?: string[]
    defaultValue?: string[]
    onChange?: (tags: string[]) => void
    placeholder?: string
    disabled?: boolean
    maxTags?: number
    validate?: (tag: string) => boolean
    onTagAdd?: (tag: string, allTags: string[]) => void
    onTagRemove?: (tag: string, allTags: string[]) => void
    className?: string
    inputId?: string
    invalid?: boolean
    size?: TypeAttributes.ControlSize
    readOnly?: boolean
}

const TAG_GAP = 4
const MORE_BUTTON_WIDTH = 70
const MIN_INPUT_WIDTH = 60

const TAG_REMOVE_SIZES: Record<
    TypeAttributes.ControlSize,
    { button: string; icon: string }
> = {
    sm: { button: 'h-3 w-3', icon: 'h-2.5 w-2.5' },
    md: { button: 'h-3 w-3', icon: 'h-2.5 w-2.5' },
    lg: { button: 'h-4 w-4', icon: 'h-3 w-3' },
}

const MultiValueInput = ({
    value,
    defaultValue = [],
    onChange,
    placeholder,
    disabled = false,
    maxTags,
    validate,
    onTagAdd,
    onTagRemove,
    className = '',
    inputId,
    invalid,
    size,
    readOnly,
    id,
    'aria-describedby': ariaDescribedByProp,
    'aria-invalid': ariaInvalidProp,
    'aria-label': ariaLabelProp,
    'aria-labelledby': ariaLabelledByProp,
    ...props
}: MultiValueInputProps) => {
    const [tags, setTags] = useControllableState({
        prop: value,
        defaultProp: defaultValue,
        onChange,
    })
    const [inputValue, setInputValue] = useState<string>('')
    const [focusedTagIndex, setFocusedTagIndex] = useState<number>(-1)
    const [visibleCount, setVisibleCount] = useState<number>(Infinity)
    const [containerWidth, setContainerWidth] = useState<number>(0)

    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const tagsContainerRef = useRef<HTMLDivElement>(null)
    const tagRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    const addTag = useCallback(
        (tagValue: string) => {
            const trimmedValue = tagValue.trim()
            if (
                !trimmedValue ||
                tags?.includes(trimmedValue) ||
                disabled ||
                readOnly
            )
                return

            if (maxTags && tags && tags.length >= maxTags) return

            if (validate && !validate(trimmedValue)) return

            const newTags = [...(tags || []), trimmedValue]
            setTags(newTags)
            setInputValue('')
            setFocusedTagIndex(-1)
            onTagAdd?.(trimmedValue, newTags)
        },
        [tags, disabled, readOnly, maxTags, validate, setTags, onTagAdd],
    )

    const removeTag = useCallback(
        (indexToRemove: number) => {
            if (disabled || readOnly || !tags) return

            const tagToRemove = tags[indexToRemove]
            const newTags = tags.filter((_, index) => index !== indexToRemove)
            setTags(newTags)
            setFocusedTagIndex(-1)
            inputRef.current?.focus()
            onTagRemove?.(tagToRemove, newTags)
        },
        [disabled, readOnly, tags, setTags, onTagRemove],
    )

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return

            switch (e.key) {
                case 'Enter':
                    e.preventDefault()
                    if (inputValue.trim()) {
                        addTag(inputValue)
                    }
                    break

                case 'Backspace':
                    if (inputValue === '' && tags && tags.length > 0) {
                        if (focusedTagIndex >= 0) {
                            removeTag(focusedTagIndex)
                        } else {
                            setFocusedTagIndex(tags.length - 1)
                        }
                    } else if (focusedTagIndex >= 0) {
                        removeTag(focusedTagIndex)
                    }
                    break

                case 'ArrowLeft':
                    if (
                        inputValue === '' ||
                        (inputValue !== '' &&
                            e.currentTarget.selectionStart === 0)
                    ) {
                        e.preventDefault()
                        const maxVisibleIndex =
                            Math.min(visibleCount, tags?.length || 0) - 1
                        if (focusedTagIndex === -1) {
                            setFocusedTagIndex(maxVisibleIndex)
                        } else if (focusedTagIndex > 0) {
                            setFocusedTagIndex(focusedTagIndex - 1)
                        }
                    }
                    break

                case 'ArrowRight':
                    if (focusedTagIndex >= 0) {
                        e.preventDefault()
                        const maxVisibleIndex =
                            Math.min(visibleCount, tags?.length || 0) - 1
                        if (focusedTagIndex < maxVisibleIndex) {
                            setFocusedTagIndex(focusedTagIndex + 1)
                        } else {
                            setFocusedTagIndex(-1)
                        }
                    }
                    break

                case 'Delete':
                    if (focusedTagIndex >= 0) {
                        e.preventDefault()
                        removeTag(focusedTagIndex)
                    }
                    break

                case 'Escape':
                    setFocusedTagIndex(-1)
                    break
            }
        },
        [
            disabled,
            readOnly,
            inputValue,
            tags,
            focusedTagIndex,
            visibleCount,
            addTag,
            removeTag,
        ],
    )

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return
            setInputValue(e.target.value)
            setFocusedTagIndex(-1)
        },
        [disabled, readOnly],
    )

    const handleContainerClick = useCallback(() => {
        if (!disabled) {
            inputRef.current?.focus()
        }
    }, [disabled])

    const handleTagClick = useCallback((index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setFocusedTagIndex(index)
    }, [])

    const handleTagKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (disabled || readOnly) return

            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault()
                    removeTag(index)
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    if (index > 0) {
                        setFocusedTagIndex(index - 1)
                    }
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    if (index < (tags?.length || 0) - 1) {
                        setFocusedTagIndex(index + 1)
                    } else {
                        setFocusedTagIndex(-1)
                        inputRef.current?.focus()
                    }
                    break
                case 'Backspace':
                case 'Delete':
                    e.preventDefault()
                    removeTag(index)
                    break
            }
        },
        [disabled, readOnly, tags, removeTag],
    )

    const calculateVisibleTags = useCallback(() => {
        if (!tagsContainerRef.current || !tags || tags.length === 0) {
            setVisibleCount(Infinity)
            return
        }

        const containerEl = tagsContainerRef.current
        const availableWidth = containerEl.offsetWidth - MIN_INPUT_WIDTH

        if (availableWidth <= 0) {
            setVisibleCount(1)
            return
        }

        let totalWidth = 0
        let count = 0

        for (let i = 0; i < tags.length; i++) {
            const tagEl = tagRefs.current.get(i)
            if (!tagEl) continue

            const tagWidth = tagEl.offsetWidth + TAG_GAP
            const needsMoreButton = i < tags.length - 1
            const reservedWidth = needsMoreButton ? MORE_BUTTON_WIDTH : 0

            if (totalWidth + tagWidth + reservedWidth <= availableWidth) {
                totalWidth += tagWidth
                count++
            } else {
                break
            }
        }

        setVisibleCount(Math.max(1, count))
    }, [tags])

    useEffect(() => {
        const container = tagsContainerRef.current
        if (!container) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })

        resizeObserver.observe(container)
        return () => resizeObserver.disconnect()
    }, [])

    useEffect(() => {
        const timer = setTimeout(calculateVisibleTags, 0)
        return () => clearTimeout(timer)
    }, [containerWidth, tags, calculateVisibleTags])

    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus()
        }
    }, [disabled])

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const multiValueInputClassNames = configClassNames?.multiValueInput
    const formControlSize = useForm()?.size
    const formField = useFormField()
    const formFieldInvalid = formField?.invalid

    const inputSize =
        size ??
        formControlSize ??
        componentDefaults?.multiValueInput?.size ??
        'md'

    const inputDefaultClass = 'input px-2 border border-control-border bg-control rounded-control w-full py-1.5 shadow-control focus:outline-none focus:ring-1 focus-within:ring-1 focus:bg-control appearance-none transition duration-150 text-control-foreground read-only:focus:ring-0 ease-in-out placeholder:text-muted-foreground'
    const inputSizeClass = `input-${inputSize} ${CONTROL_SIZES[inputSize].h}`
    const inputFocusClass =
        'input-focus focus-within:ring-control-focus focus-within:border-control-focus'

    const isInputInvalid = invalid || formFieldInvalid
    const generatedInputId = useId()
    const controlId =
        inputId ?? formField?.controlId ?? `${generatedInputId}-control`
    const ariaDescribedBy = mergeDescribedBy(
        ariaDescribedByProp,
        formField?.describedBy,
    )
    const ariaLabelledBy =
        ariaLabelledByProp ?? (!ariaLabelProp ? formField?.labelId : undefined)
    const inputClass = classNames(
        inputDefaultClass,
        inputSizeClass,
        !isInputInvalid && !readOnly && inputFocusClass,
        disabled &&
            'input-disabled bg-control-disabled text-control-disabled-foreground !cursor-not-allowed',
        isInputInvalid &&
            'input-invalid border-destructive bg-destructive-soft focus-within:ring-1 focus-within:ring-destructive focus-within:border-destructive focus-within:bg-transparent',
    )

    const isMaxTagsReached = maxTags && tags && tags.length >= maxTags
    const tagCount = tags?.length || 0
    const tagRemoveSize = TAG_REMOVE_SIZES[inputSize]

    const { visibleTags, hiddenTags, hiddenCount } = useMemo(() => {
        if (!tags) return { visibleTags: [], hiddenTags: [], hiddenCount: 0 }

        const visible = tags.slice(0, visibleCount)
        const hidden = tags.slice(visibleCount)
        return {
            visibleTags: visible,
            hiddenTags: hidden,
            hiddenCount: hidden.length,
        }
    }, [tags, visibleCount])

    const renderTag = (tag: string, index: number, isInPopover = false) => (
        <Tag
            key={`${isInPopover ? 'popover-' : ''}${index}`}
            size={inputSize}
            className={classNames(
                'gap-1 flex-shrink-0',
                multiValueInputClassNames?.tag,
            )}
            onClick={(e) => {
                if (!disabled && !readOnly && !isInPopover) {
                    handleTagClick(index, e)
                }
            }}
        >
            <span className={multiValueInputClassNames?.tagLabel}>{tag}</span>
            <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    removeTag(isInPopover ? visibleCount + index : index)
                }}
                onKeyDown={(e) => !isInPopover && handleTagKeyDown(index, e)}
                className={classNames(
                    'flex-shrink-0 rounded-full inline-flex items-center justify-center hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
                    tagRemoveSize.button,
                    multiValueInputClassNames?.tagRemove,
                )}
                aria-label={`Remove ${tag} tag`}
                tabIndex={!isInPopover && focusedTagIndex === index ? 0 : -1}
            >
                <Cross className={tagRemoveSize.icon} />
            </button>
        </Tag>
    )

    return (
        <div
            ref={containerRef}
            onClick={handleContainerClick}
            className={classNames(
                'multi-value-input group/multi-value-input',
                inputClass,
                multiValueInputClassNames?.root,
                className,
            )}
            role="group"
            aria-label={ariaLabelProp}
            aria-labelledby={ariaLabelledBy}
            id={id}
            {...props}
            data-disabled={disabled ? '' : undefined}
            data-invalid={isInputInvalid ? '' : undefined}
            data-readonly={readOnly ? '' : undefined}
        >
            <div
                ref={tagsContainerRef}
                className={classNames(
                    'flex flex-nowrap gap-1 items-center w-full min-w-0',
                    multiValueInputClassNames?.tagList,
                )}
            >
                <div
                    className="absolute opacity-0 pointer-events-none flex gap-1"
                    aria-hidden="true"
                >
                    {tags?.map((tag, index) => (
                        <div
                            key={`measure-${index}`}
                            ref={(el) => {
                                if (el) {
                                    tagRefs.current.set(index, el)
                                } else {
                                    tagRefs.current.delete(index)
                                }
                            }}
                        >
                            <Tag size={inputSize} className="gap-1">
                                <span>{tag}</span>
                                <span className={tagRemoveSize.button} />
                            </Tag>
                        </div>
                    ))}
                </div>
                {visibleTags.map((tag, index) => renderTag(tag, index))}
                {hiddenCount > 0 && (
                    <Popover
                        placement="bottom-start"
                        trigger="click"
                        width={250}
                        renderTrigger={
                            <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className={classNames(
                                    'text-xs font-medium whitespace-nowrap hover:underline focus:outline-none flex-shrink-0',
                                    multiValueInputClassNames?.overflowTrigger,
                                )}
                            >
                                +{hiddenCount} more
                            </button>
                        }
                    >
                        <div
                            className={classNames(
                                'flex flex-wrap gap-1',
                                multiValueInputClassNames?.overflowContent,
                            )}
                        >
                            {hiddenTags.map((tag, index) =>
                                renderTag(tag, index, true),
                            )}
                        </div>
                    </Popover>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={tagCount === 0 ? placeholder : ''}
                    disabled={(disabled || isMaxTagsReached) as boolean}
                    readOnly={readOnly}
                    className={classNames(
                        'flex-1 min-w-[60px] w-0 border-none outline-none bg-transparent placeholder:text-muted-foreground disabled:cursor-not-allowed',
                        multiValueInputClassNames?.input,
                    )}
                    id={controlId}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={
                        isInputInvalid ? true : ariaInvalidProp
                    }
                    aria-label={ariaLabelProp}
                    aria-labelledby={ariaLabelledBy}
                />
            </div>
        </div>
    )
}

export default MultiValueInput
