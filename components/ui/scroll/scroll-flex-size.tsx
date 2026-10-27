import Scroll from './scroll'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { ComponentProps } from 'react'
import type { BaseScrollProps } from './types'

export type ScrollProps = ComponentProps<'div'> & BaseScrollProps

export type ScrollFlexSizeProps = ScrollProps & {
    flexRootClassName?: string
}

const ScrollFlexSize = (props: ScrollFlexSizeProps) => {
    const {
        children,
        scrollbarSize,
        scrollHideDelay,
        type,
        offsetScrollbars,
        viewportRef,
        onScrollPositionChange,
        viewportProps,
        scrollbars,
        onBottomReached,
        onTopReached,
        ref,
        className,
        contentClassName,
        flexRootClassName,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const scrollClassNames = configClassNames?.scroll

    return (
        <div
            {...rest}
            ref={ref}
            className={classNames('flex overflow-auto', scrollClassNames?.flexRoot, flexRootClassName)}
        >
            <div className="flex flex-col flex-1">
                <Scroll
                    className={className}
                    scrollHideDelay={scrollHideDelay}
                    scrollbarSize={scrollbarSize}
                    type={type}
                    offsetScrollbars={offsetScrollbars}
                    viewportRef={viewportRef}
                    onScrollPositionChange={onScrollPositionChange}
                    viewportProps={viewportProps}
                    scrollbars={scrollbars}
                    onBottomReached={onBottomReached}
                    onTopReached={onTopReached}
                    contentClassName={contentClassName}
                >
                    {children}
                </Scroll>
            </div>
        </div>
    )
}

export default ScrollFlexSize
