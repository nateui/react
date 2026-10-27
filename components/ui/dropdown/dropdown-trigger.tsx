import {
    useState,
    useRef,
    useContext,
    useEffect,
    useImperativeHandle,
    isValidElement,
} from 'react'
import DropdownToggle from './dropdown-toggle'
import DropdownSubItem from './dropdown-sub-item'
import MenuContext from './context/menu-context'
import { dropdownContentClass } from './styles'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingList,
    FloatingNode,
    FloatingPortal,
    safePolygon,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingTree,
    useHover,
    useInteractions,
    useListItem,
    useListNavigation,
    useMergeRefs,
    useRole,
    useTypeahead,
    useTransitionStyles,
} from '@floating-ui/react'
import transition from '@/utils/transitions'
import type { DropdownToggleSharedProps } from './dropdown-toggle'
import type { DropdownSubItemSharedProps } from './dropdown-sub-item'
import type { TypeAttributes } from '../config-provider/index'
import type {
    HTMLProps,
    FocusEvent,
    MouseEvent,
    ReactNode,
    Ref,
    ComponentProps,
    ElementType,
    SyntheticEvent,
} from 'react'

export type DropdownTriggerProps = ComponentProps<ElementType> & DropdownToggleSharedProps & DropdownSubItemSharedProps & {
    activeKey?: string
    title?: string | ReactNode
    menuClass?: string
    trigger?: 'click' | 'hover' | 'rightClick'
    placement?: TypeAttributes.Placement
    onOpen?: (bool: boolean) => void
    ref?: Ref<HTMLElement | DropdownTriggerRef>
}

export type DropdownTriggerRef = {
    handleDropdownOpen: () => void
    handleDropdownClose: () => void
}

const DropdownTrigger = (
    props: DropdownTriggerProps & HTMLProps<HTMLElement>,
) => {
    const {
        children,
        title,
        renderTitle,
        disabled,
        toggleClassName,
        menuClass,
        placement,
        trigger = 'click',
        onOpen,
        ref,
        ...rest
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const [hasFocusInside, setHasFocusInside] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [returnFocus, setReturnFocus] = useState(true)
    const [keyboardFocus, setKeyboardFocus] = useState(false)

    const elementsRef = useRef<Array<HTMLElement | null>>([])
    const labelsRef = useRef<Array<string | null>>([])

    const { classNames: configClassNames, direction } = useConfig()
    const dropdownClassNames = configClassNames?.dropdown

    const parent = useContext(MenuContext)

    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const item = useListItem()

    const isNested = parentId != null

    const isKeyboardInteraction = (event?: Event) => {
        if (!event) return false
        if (event.type === 'keydown') return true
        return event.type === 'click' &&
            (event as Event & { detail?: number }).detail === 0
    }

    const handleOpen = (
        open: boolean,
        event?: Event,
        reason?: string,
    ) => {
        if (disabled) {
            return
        }
        setReturnFocus(
            open ||
                reason === 'escape-key' ||
                reason === 'list-navigation' ||
                isKeyboardInteraction(event),
        )
        setKeyboardFocus(
            !open &&
                (reason === 'escape-key' ||
                    reason === 'list-navigation' ||
                    isKeyboardInteraction(event)),
        )
        setIsOpen(open)
        onOpen?.(open)
    }

    const getDefaultPlacement = () => {
        return direction === 'ltr' ? 'bottom-start' : 'bottom-end'
    }

    const getNestedDefaultPlacement = () => {
        return direction === 'ltr' ? 'right-start' : 'left-start'
    }

    const { floatingStyles, refs, context } = useFloating<HTMLElement>({
        nodeId,
        open: isOpen,
        onOpenChange: (open, event, reason) => {
            handleOpen(open, event, reason)
        },
        placement:
            placement ||
            (isNested ? getNestedDefaultPlacement() : getDefaultPlacement()),
        middleware: [flip(), shift()],
        whileElementsMounted: autoUpdate,
    })

    const { isMounted, styles } = useTransitionStyles(context, {
        duration: 200,
        ...transition(context.placement),
    })

    const hover = useHover(context, {
        enabled: isNested || trigger === 'hover',
        delay: { open: 75 },
        handleClose: safePolygon({ blockPointerEvents: true }),
    })

    const click = useClick(context, {
        event: 'click',
        toggle: !isNested,
        ignoreMouse: isNested,
    })

    const role = useRole(context, { role: 'menu' })

    const dismiss = useDismiss(context, { bubbles: true })

    const listNavigation = useListNavigation(context, {
        listRef: elementsRef,
        activeIndex,
        nested: isNested,
        loop: true,
        rtl: direction === 'rtl',
        focusItemOnOpen: 'auto',
        onNavigate: setActiveIndex,
    })
    const typeahead = useTypeahead(context, {
        listRef: labelsRef,
        onMatch: isOpen ? setActiveIndex : undefined,
        activeIndex,
    })

    const { getReferenceProps, getFloatingProps, getItemProps } =
        useInteractions([
            hover,
            role,
            dismiss,
            listNavigation,
            typeahead,
            ...(trigger !== 'rightClick' ? [click] : []),
        ])

    useEffect(() => {
        if (!tree) return

        function handleTreeClick(event?: Event) {
            setReturnFocus(isKeyboardInteraction(event))
            setKeyboardFocus(isKeyboardInteraction(event))
            setIsOpen(false)
            onOpen?.(false)
        }

        function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
            if (event.nodeId !== nodeId && event.parentId === parentId) {
                setIsOpen(false)
                onOpen?.(false)
            }
        }

        tree.events.on('click', handleTreeClick)
        tree.events.on('menuopen', onSubMenuOpen)

        return () => {
            tree.events.off('click', handleTreeClick)
            tree.events.off('menuopen', onSubMenuOpen)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tree, nodeId, parentId])

    useEffect(() => {
        if (isOpen && tree) {
            tree.events.emit('menuopen', { parentId, nodeId })
        }
    }, [tree, isOpen, nodeId, parentId])

    useEffect(() => {
        if (!isOpen || activeIndex == null) return
        const activeItem = elementsRef.current[activeIndex]
        activeItem?.focus({ preventScroll: true })
    }, [activeIndex, isOpen])

    const renderedTriggerProps = !isNested && isValidElement(renderTitle)
        ? (renderTitle.props as HTMLProps<HTMLElement> & {
              ref?: Ref<HTMLElement>
          })
        : undefined

    const {
        ref: renderedTriggerRef,
        ...renderedTriggerUserProps
    } = (renderedTriggerProps || {}) as HTMLProps<HTMLElement> & {
        ref?: Ref<HTMLElement>
    }

    const toggleRef = useMergeRefs([
        refs.setReference,
        item.ref,
        renderedTriggerRef,
        ref,
    ])

    useImperativeHandle(ref, () => {
        return {
            handleDropdownOpen: () => {
                setReturnFocus(true)
                setKeyboardFocus(false)
                setIsOpen(true)
                onOpen?.(true)
            },
            handleDropdownClose: () => {
                setReturnFocus(false)
                setKeyboardFocus(false)
                setIsOpen(false)
                onOpen?.(false)
            },
        }
    }, [onOpen])

    const callHandlers = <E extends SyntheticEvent>(
        event: E,
        first?: (event: E) => void,
        second?: (event: E) => void,
    ) => {
        first?.(event)
        if (!event.defaultPrevented && second !== first) {
            second?.(event)
        }
    }

    const toggleProps: HTMLProps<HTMLElement> = {
        ...getReferenceProps(
            parent.getItemProps({
                ...renderedTriggerUserProps,
                ...rest,
                onFocus(event: FocusEvent<HTMLElement>) {
                    callHandlers(
                        event,
                        renderedTriggerUserProps.onFocus,
                        rest.onFocus,
                    )
                    setHasFocusInside(false)
                    parent.setHasFocusInside(true)
                },
                onClick(event) {
                    callHandlers(
                        event,
                        renderedTriggerUserProps.onClick,
                        rest.onClick,
                    )
                },
                onMouseDown(event) {
                    callHandlers(
                        event,
                        renderedTriggerUserProps.onMouseDown,
                        rest.onMouseDown,
                    )
                },
                onKeyDown(event) {
                    callHandlers(
                        event,
                        renderedTriggerUserProps.onKeyDown,
                        rest.onKeyDown,
                    )
                },
            }),
        ),
        ...(trigger === 'rightClick'
            ? {
                  onContextMenu: (e: MouseEvent<HTMLElement>) => {
                      e.preventDefault()
                      handleOpen(true)
                  },
              }
            : {}),
    }

    return (
        <FloatingNode id={nodeId}>
            {!isNested ? (
                <DropdownToggle
                    ref={toggleRef}
                    data-open={isOpen ? '' : undefined}
                    data-focus-inside={hasFocusInside ? '' : undefined}
                    disabled={disabled}
                    placement={placement}
                    renderTitle={renderTitle}
                    {...toggleProps}
                    data-focus-visible={keyboardFocus ? '' : undefined}
                    className={classNames(
                        dropdownClassNames?.trigger,
                        toggleClassName,
                        toggleProps.className,
                    )}
                >
                    {title}
                </DropdownToggle>
            ) : (
                <DropdownSubItem
                    ref={toggleRef}
                    tabIndex={parent.activeIndex === item.index ? 0 : -1}
                    data-open={isOpen ? '' : undefined}
                    data-nested={''}
                    data-focus-inside={hasFocusInside ? '' : undefined}
                    {...toggleProps}
                    className={classNames(
                        dropdownClassNames?.subTrigger,
                        toggleClassName,
                        toggleProps.className,
                    )}
                >
                    {renderTitle ? renderTitle : title}
                </DropdownSubItem>
            )}
            <MenuContext.Provider
                value={{
                    activeIndex,
                    setActiveIndex,
                    getItemProps,
                    setHasFocusInside,
                    isOpen,
                }}
            >
                <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                    {isMounted && (
                        <FloatingPortal>
                            <FloatingFocusManager
                                context={context}
                                modal={false}
                                initialFocus={-1}
                                returnFocus={isNested ? false : returnFocus}
                            >
                                <div
                                    ref={refs.setFloating}
                                    style={floatingStyles}
                                    {...getFloatingProps()}
                                    className={classNames(
                                        'dropdown-menu-wrapper outline-hidden z-popover',
                                        dropdownClassNames?.contentWrapper,
                                    )}
                                >
                                    <ul
                                        role="none"
                                        className={classNames(
                                            dropdownContentClass,
                                            dropdownClassNames?.content,
                                            menuClass,
                                        )}
                                        style={styles}
                                    >
                                        {children}
                                    </ul>
                                </div>
                            </FloatingFocusManager>
                        </FloatingPortal>
                    )}
                </FloatingList>
            </MenuContext.Provider>
        </FloatingNode>
    )
}

export default DropdownTrigger
