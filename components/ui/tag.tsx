import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { ReactNode, ComponentPropsWithRef } from 'react'
import type { TypeAttributes } from './config-provider/types'

export type TagProps = {
    children: ReactNode
    size?: TypeAttributes.ControlSize
    prefix?: boolean | ReactNode
    prefixClass?: string
    suffix?: boolean | ReactNode
    suffixClass?: string
} & Omit<ComponentPropsWithRef<'div'>, 'prefix'>

const TAG_SIZES: Record<TypeAttributes.ControlSize, string> = {
    sm: 'py-0 px-1.5 text-xs',
    md: 'py-0.5 px-2 text-xs',
    lg: 'py-1 px-2.5 text-sm',
}

const Tag = (props: TagProps) => {
    const {
        className,
        children,
        size: sizeProp,
        prefix,
        ref,
        suffix,
        prefixClass,
        suffixClass,
        ...rest
    } = props
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const tagClassNames = configClassNames?.tag
    const size = sizeProp ?? componentDefaults?.tag?.size ?? 'md'

    return (
        <span
            ref={ref}
            className={classNames(
                'tag bg-tag border border-tag-border text-foreground rounded-tag items-center inline-flex font-semibold whitespace-nowrap',
                TAG_SIZES[size],
                tagClassNames?.root,
                className,
            )}
            {...rest}
        >
            {prefix && typeof prefix === 'boolean' && (
                <span
                    className={classNames(
                        'tag-affix tag-prefix h-2 w-2 rounded-full bg-muted-foreground mr-1.5 rtl:ml-1.5',
                        tagClassNames?.prefix,
                        prefixClass,
                    )}
                />
            )}
            {typeof prefix === 'object' && prefix}
            {tagClassNames?.label ? (
                <span className={tagClassNames.label}>{children}</span>
            ) : (
                children
            )}
            {suffix && typeof suffix === 'boolean' && (
                <span
                    className={classNames(
                        'tag-affix tag-suffix h-2 w-2 rounded-full bg-muted-foreground ml-1.5 rtl:mr-1.5',
                        tagClassNames?.suffix,
                        suffixClass,
                    )}
                />
            )}
            {typeof suffix === 'object' && suffix}
        </span>
    )
}

export default Tag

export { Tag }
