import { useCallback } from 'react'

import useControllableState from '@/hooks/use-controllable-state'
import CollapsibleContext from './context'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { ComponentProps } from 'react'

export type CollapsibleProps = ComponentProps<'div'> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const Collapsible = ({
    children,
    open,
    defaultOpen = false,
    className = '',
    onOpenChange,
}: CollapsibleProps) => {
    const { classNames: configClassNames } = useConfig()
    const collapsibleClassNames = configClassNames?.collapsible
    const [isOpen, setIsOpen] = useControllableState<boolean>({
        prop: open,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    })

    const toggle = useCallback(() => {
        setIsOpen((prevOpen) => !prevOpen)
    }, [setIsOpen])

    return (
        <CollapsibleContext.Provider value={{ isOpen: !!isOpen, toggle }}>
            <div
                className={classNames(collapsibleClassNames?.root, className)}
                data-state={isOpen ? 'open' : 'closed'}
            >
                {children}
            </div>
        </CollapsibleContext.Provider>
    )
}

export default Collapsible
