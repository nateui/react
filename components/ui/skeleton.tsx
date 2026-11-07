import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { ElementType, Ref, ComponentProps } from 'react'

export type SkeletonProps = ComponentProps<ElementType> & {
    animation?: boolean
    asElement?: ElementType
    height?: string | number
    ref?: Ref<ElementType>
    variant?: 'block' | 'circle'
    width?: string | number
}

const Skeleton = (props: SkeletonProps) => {
    const {
        animation = true,
        asElement: Component = 'span',
        className,
        height,
        ref,
        style,
        variant = 'block',
        width,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const skeletonClassNames = configClassNames?.skeleton

    return (
        <Component
            ref={ref}
            className={classNames(
                'skeleton bg-muted flex',
                variant === 'circle' && 'skeleton-circle rounded-full w-10 h-10',
                variant === 'block' && 'skeleton-block rounded h-2.5 w-full',
                animation && 'animate-pulse',
                skeletonClassNames?.root,
                className,
            )}
            style={{
                width,
                height,
                ...style,
            }}
            {...rest}
        />
    )
}

export default Skeleton

export { Skeleton }
