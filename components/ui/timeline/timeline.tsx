import { Children } from 'react'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import mapCloneElement from '@/utils/map-clone-element'
import type { DetailedReactHTMLElement, ComponentPropsWithRef } from 'react'

export type TimelineProps = ComponentPropsWithRef<'ul'>

const Timeline = (props: TimelineProps) => {
    const { children, className, ref } = props
    const { classNames: configClassNames } = useConfig()
    const timelineClassNames = configClassNames?.timeline

    const count = Children.count(children)

    const items = mapCloneElement(
        children,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: DetailedReactHTMLElement<any, HTMLElement>, index: number) => ({
            isLast: index === count - 1,
            ...item.props,
        }),
    )

    return (
        <ul
            ref={ref}
            className={classNames(
                'timeline flex-col items-start',
                timelineClassNames?.root,
                className,
            )}
        >
            {items}
        </ul>
    )
}

export default Timeline
