'use client'

import { useState, useEffect, useRef } from 'react'
import useMergedRef from '@/hooks/use-merge-ref'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { TypeAttributes } from '../config-provider/types'
import type { ReactNode, Ref, ComponentProps } from 'react'

export type AvatarProps = ComponentProps<'span'> & {
    alt?: string
    icon?: ReactNode
    onClick?: () => void
    ref?: Ref<HTMLSpanElement>
    size?: 'lg' | 'md' | 'sm' | number
    shape?: Exclude<TypeAttributes.Shape, 'none'> | 'square'
    src?: string
    srcSet?: string
}

const Avatar = (props: AvatarProps) => {
    const {
        alt,
        className,
        icon,
        ref = null,
        shape: shapeProp,
        size: sizeProp,
        src,
        srcSet,
        ...rest
    } = props

    let { children } = props
    const [scale, setScale] = useState(1)
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const shape = shapeProp ?? componentDefaults?.avatar?.shape ?? 'circle'
    const size = sizeProp ?? componentDefaults?.avatar?.size ?? 'md'
    const avatarClassNames = configClassNames?.avatar

    const avatarChildren = useRef<HTMLSpanElement>(null)
    const avatarNode = useRef<HTMLSpanElement>(null)

    const avatarMergeRef = useMergedRef(ref, avatarNode)

    const innerScale = () => {
        if (!avatarChildren.current || !avatarNode.current) {
            return
        }
        const avatarChildrenWidth = avatarChildren.current.offsetWidth
        const avatarNodeWidth = avatarNode.current.offsetWidth
        if (avatarChildrenWidth === 0 || avatarNodeWidth === 0) {
            return
        }
        setScale(
            avatarNodeWidth - 8 < avatarChildrenWidth
                ? (avatarNodeWidth - 8) / avatarChildrenWidth
                : 1,
        )
    }

    useEffect(() => {
        innerScale()
    }, [scale, children])

    const sizeStyle =
        typeof size === 'number'
            ? {
                  width: size,
                  height: size,
                  minWidth: size,
                  lineHeight: `${size}px`,
                  fontSize: icon ? size / 2 : 10,
              }
            : {}

    const classes = classNames(
        'avatar inline-flex relative bg-muted text-muted-foreground border items-center justify-center',
        `avatar-${shape}`,
        shape === 'round' && 'avatar-round rounded-control-sm',
        shape === 'square' && 'avatar-square rounded-none',
        shape === 'circle' && 'avatar-circle rounded-full',
        typeof size === 'string' ? `avatar-${size}` : '',
        size === 'sm' && 'w-8 h-8 leading-8',
        size === 'md' && 'w-10 h-10 leading-10',
        size === 'lg' && 'w-12 h-12 leading-10',
        avatarClassNames?.root,
        className,
    )

    if (src) {
        children = (
            <img
                className={classNames(
                    `avatar-img avatar-${shape} block w-full h-full object-cover`,
                    shape === 'round' && 'avatar-round rounded-control-sm',
                    shape === 'square' && 'avatar-square rounded-none',
                    shape === 'circle' && 'avatar-circle rounded-full',
                    avatarClassNames?.image,
                )}
                src={src}
                srcSet={srcSet}
                alt={alt}
                loading="lazy"
            />
        )
    } else if (icon) {
        children = (
            <span
                className={classNames(
                    'avatar-icon flex items-center justify-center h-full',
                    `avatar-icon-${size}`,
                    size === 'sm' && 'text-lg',
                    size === 'md' && 'text-xl',
                    size === 'lg' && 'text-2xl',
                    avatarClassNames?.icon,
                )}
            >
                {icon}
            </span>
        )
    } else {
        const childrenSizeStyle =
            typeof size === 'number' ? { lineHeight: `${size}px` } : {}
        const stringCentralized = {
            transform: `translateX(-50%) scale(${scale})`,
        }
        children = (
            <span
                ref={avatarChildren}
                className={classNames(
                    'avatar-string absolute origin-center left-2/4 flex items-center font-semibold',
                    typeof size === 'number' ? '' : `avatar-inner-${size}`,
                    size === 'sm' && 'h-8',
                    size === 'md' && 'h-10',
                    size === 'lg' && 'h-12',
                    avatarClassNames?.fallback,
                )}
                style={{
                    ...childrenSizeStyle,
                    ...stringCentralized,
                    ...(typeof size === 'number' ? { height: size } : {}),
                }}
            >
                {children}
            </span>
        )
    }

    return (
        <span
            ref={avatarMergeRef}
            className={classes}
            style={{ ...sizeStyle, ...rest.style }}
            {...rest}
        >
            {children}
        </span>
    )
}

export default Avatar
