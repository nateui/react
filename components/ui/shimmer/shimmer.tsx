import classNames from '@/utils/class-names'
import type { ComponentProps, Ref } from 'react'
import styles from './shimmer.module.css'

export type ShimmerProps = ComponentProps<'span'> & {
    active?: boolean
    ref?: Ref<HTMLSpanElement>
}

const Shimmer = (props: ShimmerProps) => {
    const { active = true, className, ref, ...rest } = props

    return (
        <span
            ref={ref}
            className={classNames(
                'inline-block',
                active && styles.sweep,
                active
                    ? 'bg-gradient-to-r from-muted-foreground via-foreground to-foreground bg-[length:200%_100%] bg-clip-text text-transparent motion-reduce:bg-none motion-reduce:text-foreground'
                    : 'text-foreground',
                className,
            )}
            {...rest}
        />
    )
}

export default Shimmer
