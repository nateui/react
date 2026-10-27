import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from '../icons/index'
import type { Placement } from '@floating-ui/react'
import { cloneElement, Fragment, isValidElement } from 'react'
import type {
    ReactElement,
    ReactNode,
    HTMLProps,
    Ref,
} from 'react'

export interface DropdownToggleSharedProps {
    renderTitle?: ReactNode
    placement?: Placement
    toggleClassName?: string
    disabled?: boolean
}

export type DropdownToggleProps = HTMLProps<HTMLElement> & DropdownToggleSharedProps & {
    id?: string
    ref?: Ref<HTMLElement>
}

const DropdownToggleDefaultContent = ({
    placement,
    children,
    indicatorClassName,
    labelClassName,
}: {
    placement: Placement
    children: string | ReactNode
    indicatorClassName?: string
    labelClassName?: string
}) => {
    const label = labelClassName ? (
        <span className={labelClassName}>{children}</span>
    ) : (
        children
    )
    const renderIndicator = (icon: ReactNode) =>
        indicatorClassName ? (
            <span className={indicatorClassName}>{icon}</span>
        ) : (
            icon
        )

    if (placement && placement.includes('right')) {
        return (
            <>
                {label}
                {renderIndicator(<ChevronRight />)}
            </>
        )
    }

    if (placement && placement.includes('left')) {
        return (
            <>
                {renderIndicator(<ChevronLeft />)}
                {label}
            </>
        )
    }

    if (placement && placement.includes('right')) {
        return (
            <>
                {label}
                {renderIndicator(<ChevronUp />)}
            </>
        )
    }

    return (
        <>
            {label}
            {renderIndicator(<ChevronDown />)}
        </>
    )
}

const DropdownToggle = (
    props: DropdownToggleProps,
) => {
    const {
        className,
        renderTitle,
        children,
        placement = 'bottom-start',
        disabled,
        ref,
        toggleClassName,
        type: typeProp,
        ...rest
    } = props

    const { classNames: configClassNames } = useConfig()
    const dropdownClassNames = configClassNames?.dropdown
    const hasKeyboardFocus =
        (rest as unknown as Record<string, unknown>)['data-focus-visible'] !==
        undefined

    const toggleClass = 'dropdown-toggle'
    const disabledClass = 'dropdown-toggle-disabled'

    const dropdownToggleClass = classNames(
        toggleClass,
        'group/dropdown-trigger',
        className,
        toggleClassName,
        disabled && disabledClass,
    )

    const dropdownToggleDefaultClass = classNames(
        dropdownToggleClass,
        'dropdown-toggle-default cursor-pointer p-1 inline-block font-semibold',
        disabled && 'opacity-60 cursor-not-allowed',
        !disabled &&
            'focus-visible:outline-none',
        hasKeyboardFocus && 'bg-accent',
    )

    if (
        renderTitle &&
        isValidElement(renderTitle) &&
        renderTitle.type !== Fragment
    ) {
        const trigger = renderTitle as ReactElement<HTMLProps<HTMLElement>>
        const triggerProps = trigger.props
        const nativeElement =
            typeof trigger.type === 'string' ? trigger.type : undefined
        const isNativeButton = nativeElement === 'button'
        const isNativeLink = nativeElement === 'a' && Boolean(triggerProps.href)
        const needsButtonSemantics = !isNativeButton && !isNativeLink
        const customFocusClass = needsButtonSemantics
            ? classNames(
                  'focus-visible:outline-none',
                  hasKeyboardFocus && 'bg-accent',
              )
            : 'focus-visible:outline-none'

        return cloneElement(trigger, {
            ...rest,
            ref,
            className: classNames(
                triggerProps.className,
                dropdownClassNames?.triggerLabel,
                dropdownToggleClass,
                customFocusClass,
            ),
            ...(isNativeButton || nativeElement === undefined
                ? { disabled }
                : { 'aria-disabled': disabled || undefined }),
            ...(isNativeButton
                ? {
                      type:
                          (triggerProps.type as
                              | 'button'
                              | 'submit'
                              | 'reset'
                              | undefined) ||
                          (typeProp as
                              | 'button'
                              | 'submit'
                              | 'reset'
                              | undefined) ||
                          'button',
                  }
                : {}),
            ...(needsButtonSemantics
                ? {
                      role: triggerProps.role || 'button',
                      tabIndex: disabled
                          ? -1
                          : (triggerProps.tabIndex ?? 0),
                  }
                : {}),
        })
    }

    if (renderTitle) {
        return (
            <button
                ref={ref as Ref<HTMLButtonElement>}
                type={
                    (typeProp as
                        | 'button'
                        | 'submit'
                        | 'reset'
                        | undefined) || 'button'
                }
                disabled={disabled}
                className={classNames(
                    dropdownToggleClass,
                    !disabled &&
                        'focus-visible:outline-none',
                    hasKeyboardFocus && 'bg-accent',
                )}
                {...rest}
            >
                {dropdownClassNames?.triggerLabel ? (
                    <span className={dropdownClassNames.triggerLabel}>
                        {renderTitle}
                    </span>
                ) : (
                    renderTitle
                )}
            </button>
        )
    }

    return (
        <button
            ref={ref as Ref<HTMLButtonElement>}
            type={
                (typeProp as
                    | 'button'
                    | 'submit'
                    | 'reset'
                    | undefined) || 'button'
            }
            disabled={disabled}
            className={dropdownToggleDefaultClass}
            {...rest}
        >
            <span className="flex items-center gap-1">
                <DropdownToggleDefaultContent
                    placement={placement}
                    indicatorClassName={dropdownClassNames?.triggerIndicator}
                    labelClassName={dropdownClassNames?.triggerLabel}
                >
                    {children}
                </DropdownToggleDefaultContent>
            </span>
        </button>
    )
}

export default DropdownToggle
