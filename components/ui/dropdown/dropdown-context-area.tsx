import { useCallback, useState, useRef, useEffect, useImperativeHandle } from 'react'
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
    shift,
    useClick,
    useHover,
    useDismiss,
    useFloating,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingTree,
    useInteractions,
    useListNavigation,
    useRole,
    useTypeahead,
    useTransitionStyles,
    safePolygon,
} from '@floating-ui/react'
import transition from '@/utils/transitions'
import type { DropdownToggleSharedProps } from './dropdown-toggle'
import type { DropdownSubItemSharedProps } from './dropdown-sub-item'
import type { Placement } from '@floating-ui/react'
import type { ReactNode, HTMLProps, Ref, ComponentProps } from 'react'
import useMergeRef from '@/hooks/use-merge-ref'

export type DropdownContextAreaProps =
     Omit<ComponentProps<'div'>, 'ref'> &
        Omit<DropdownToggleSharedProps, 'toggleClassName'> &
        DropdownSubItemSharedProps & {
    activeKey?: string
    menuClass?: string
    placement?: Placement
    onOpen?: (bool: boolean) => void
    ref?: Ref<HTMLElement | DropdownContextAreaRef>
    areaContent: ReactNode
    areaClass?: string
    areaRef?: Ref<HTMLDivElement>
}

export type DropdownContextAreaRef = {
    handleDropdownOpen: () => void
    handleDropdownClose: () => void
    openAt: (x: number, y: number) => void
}

const DropdownContextArea = (
    props: DropdownContextAreaProps & Omit<HTMLProps<HTMLElement>, 'ref'>,
) => {
    const {
        children,
        disabled,
        menuClass,
        placement,
        onOpen,
        areaContent,
        areaClass,
        ref,
        areaRef = null,
        ...rest
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const setHasFocusInside = useState(false)[1]
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [focusItemOnOpen, setFocusItemOnOpen] = useState<boolean | 'auto'>('auto')
    const [returnFocus, setReturnFocus] = useState(true)
    const [keyboardFocus, setKeyboardFocus] = useState(false)

    const areaInnerRef = useRef<HTMLDivElement | null>(null)

    const elementsRef = useRef<Array<HTMLElement | null>>([])
    const labelsRef = useRef<Array<string | null>>([])

    const { classNames: configClassNames, direction } = useConfig()
    const dropdownClassNames = configClassNames?.dropdown

    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()

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
        if (!open) {
            setFocusItemOnOpen('auto')
        }
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

    const contentAreaRef = useMergeRef(
        areaInnerRef,
        areaRef,
        refs.setReference,
    )

    const { isMounted, styles } = useTransitionStyles(context, {
        duration: 200,
        ...transition(context.placement),
    })

    const hover = useHover(context, {
        enabled: isNested,
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
        focusItemOnOpen,
        onNavigate: setActiveIndex,
    })
    const typeahead = useTypeahead(context, {
        listRef: labelsRef,
        onMatch: isOpen ? setActiveIndex : undefined,
        activeIndex,
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        hover,
        role,
        dismiss,
        listNavigation,
        typeahead,
        ...[click],
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
        if (!isOpen || focusItemOnOpen !== true || activeIndex != null) {
            return
        }
        const firstIndex = elementsRef.current.findIndex(
            (element) =>
                element != null &&
                !element.hasAttribute('disabled') &&
                element.getAttribute('aria-disabled') !== 'true',
        )
        if (firstIndex !== -1) {
            setActiveIndex(firstIndex)
        }
        const frame = requestAnimationFrame(() => {
            if (activeIndex == null) {
                const currentFirstIndex = elementsRef.current.findIndex(
                    (element) =>
                        element != null &&
                        !element.hasAttribute('disabled') &&
                        element.getAttribute('aria-disabled') !== 'true',
                )
                if (currentFirstIndex !== -1) {
                    setActiveIndex(currentFirstIndex)
                }
            }
        })
        return () => cancelAnimationFrame(frame)
    }, [activeIndex, focusItemOnOpen, isOpen])

    useEffect(() => {
        if (!isOpen || activeIndex == null) return
        const activeItem = elementsRef.current[activeIndex]
        activeItem?.focus({ preventScroll: true })
    }, [activeIndex, isOpen])

    const openAt = useCallback(
        (x: number, y: number, shouldFocusItem = false) => {
            if (disabled) return
            setFocusItemOnOpen(shouldFocusItem ? true : 'auto')
            setKeyboardFocus(shouldFocusItem)
            refs.setPositionReference({
                getBoundingClientRect: () =>
                    ({
                        x,
                        y,
                        width: 0,
                        height: 0,
                        top: y,
                        left: x,
                        bottom: y,
                        right: x,
                    }) as DOMRect,
                contextElement: areaInnerRef.current || undefined,
            })
            setIsOpen(true)
            onOpen?.(true)
        },
        [disabled, onOpen, refs],
    )

    const handleContextMenu = (e: React.MouseEvent) => {
        if (
            areaInnerRef.current &&
            areaInnerRef.current.contains(e.target as Node)
        ) {
            e.preventDefault()
            openAt(e.clientX, e.clientY)
        }
    }

    useImperativeHandle(ref, () => {
        return {
            handleDropdownOpen: () => {
                setFocusItemOnOpen('auto')
                setReturnFocus(true)
                setKeyboardFocus(false)
                setIsOpen(true)
                onOpen?.(true)
            },
            handleDropdownClose: () => {
                setFocusItemOnOpen('auto')
                setReturnFocus(false)
                setKeyboardFocus(false)
                setIsOpen(false)
                onOpen?.(false)
            },
            openAt,
        }
    }, [onOpen, openAt])

    return (
        <FloatingNode id={nodeId}>
            <MenuContext.Provider
                value={{
                    activeIndex,
                    setActiveIndex,
                    getItemProps,
                    setHasFocusInside,
                    isOpen,
                }}
            >
                <div
                    ref={contentAreaRef}
                    {...getReferenceProps({
                        ...rest,
                        onContextMenu: (event) => {
                            rest.onContextMenu?.(
                                event as React.MouseEvent<HTMLDivElement>,
                            )
                            if (!event.defaultPrevented) {
                                handleContextMenu(event)
                            }
                        },
                        onKeyDown: (event) => {
                            rest.onKeyDown?.(
                                event as React.KeyboardEvent<HTMLDivElement>,
                            )
                            if (
                                !event.defaultPrevented &&
                                (event.key === 'ContextMenu' ||
                                    (event.shiftKey && event.key === 'F10'))
                            ) {
                                event.preventDefault()
                                const rect = event.currentTarget.getBoundingClientRect()
                                openAt(rect.left, rect.bottom, true)
                            }
                        },
                    })}
                    tabIndex={disabled ? undefined : (rest.tabIndex ?? 0)}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-disabled={disabled || undefined}
                    className={classNames(
                        dropdownClassNames?.contextArea,
                        areaClass,
                        rest.className,
                        keyboardFocus && 'bg-accent',
                        !disabled && 'focus-visible:bg-accent focus-visible:outline-none',
                    )}
                >
                    {areaContent}
                </div>
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

export default DropdownContextArea
