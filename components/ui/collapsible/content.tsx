import classNames from '@/utils/class-names'
import { motion, AnimatePresence } from 'motion/react'
import { useCollapsible } from './context'
import { useConfig } from '../config-provider/index'
import type { ComponentProps } from 'react'

export type CollapsibleContentProps = ComponentProps<'div'> & {
    defaultOverflowHidden?: boolean
}

const Content = ({
    children,
    className = '',
    defaultOverflowHidden = true,
}: CollapsibleContentProps) => {
    const { isOpen } = useCollapsible()
    const { classNames: configClassNames } = useConfig()
    const collapsibleClassNames = configClassNames?.collapsible

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={classNames(
                        defaultOverflowHidden && 'overflow-hidden',
                        collapsibleClassNames?.content,
                        className,
                    )}
                    data-state={isOpen ? 'open' : 'closed'}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Content
