import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Timeline from './timeline'
import type { TimelineProps } from './timeline'
import TimeLineItem from './time-line-item'

export type { TimelineProps } from './timeline'
export type { TimeLineItemProps } from './time-line-item'

type CompoundedComponent = ForwardRefExoticComponent<
    TimelineProps & RefAttributes<HTMLUListElement>
> & {
    Item: typeof TimeLineItem
}

const Timeline = _Timeline as CompoundedComponent

Timeline.Item = TimeLineItem

export { Timeline }

export default Timeline
