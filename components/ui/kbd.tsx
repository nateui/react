import classNames from '@/utils/class-names'
import type { ComponentProps } from 'react'

export type KbdProps = ComponentProps<'kbd'>

const Kbd = ({ children, className, ...props }: KbdProps) => (
    <kbd 
        className={
            classNames(
                'inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-medium bg-tag border border-tag-border rounded-tag text-muted-foreground gap-1',
                typeof children === 'string' ? 'font-mono' : '',
                className
        )
        } 
            {...props}
    >
        {children}
    </kbd>
)

export default Kbd