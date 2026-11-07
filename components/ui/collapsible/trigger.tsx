import { motion } from 'motion/react'
import { useCollapsible } from './context'
import { ChevronDown } from '../icons/index'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { ReactNode } from 'react'

export interface CollapsibleTriggerProps {
    children:
        | ((props: { isOpen: boolean; toggle: () => void }) => ReactNode)
        | ReactNode
    className?: string
}

const Trigger = (props: CollapsibleTriggerProps) => {
    const { isOpen, toggle } = useCollapsible()
    const { classNames: configClassNames } = useConfig()
    const collapsibleClassNames = configClassNames?.collapsible

    const { children, className } = props

    if (typeof children === 'function') {
        return <>{children({ isOpen, toggle })}</>
    }

    return (
        <button
            className={classNames(
                'flex items-center justify-between w-full p-4 font-medium text-left focus:outline-none',
                collapsibleClassNames?.trigger,
                className,
            )}
            data-state={isOpen ? 'open' : 'closed'}
            onClick={toggle}
            aria-expanded={isOpen}
            type="button"
        >
            <span className={collapsibleClassNames?.triggerLabel}>
                {children}
            </span>
            <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={classNames(
                    'flex items-center',
                    collapsibleClassNames?.indicator,
                )}
            >
                <ChevronDown />
            </motion.span>
        </button>
    )
}

export default Trigger
