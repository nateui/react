import type { RefAttributes } from 'react'
import _Segment from './segment'
import type { SegmentProps } from './segment'
import SegmentItem from './segment-item'

export type { SegmentProps } from './segment'
export type { SegmentItemProps } from './segment-item'

type CompoundedComponent = (<T extends 'single' | 'multiple' = 'single'>(
    props: SegmentProps<T> & RefAttributes<HTMLSpanElement>,
) => React.ReactElement) & {
    Item: typeof SegmentItem
}

const Segment = _Segment as CompoundedComponent

Segment.Item = SegmentItem

export { Segment }

export default Segment
