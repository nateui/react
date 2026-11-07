import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Collapsible from './collapsible'
import type { CollapsibleProps } from './collapsible'
import Content from './content'
import Trigger from './trigger'

export type { CollapsibleProps } from './collapsible'
export type { CollapsibleContentProps } from './content'
export type { CollapsibleTriggerProps } from './trigger'

type CompoundedComponent = ForwardRefExoticComponent<
    CollapsibleProps & RefAttributes<HTMLSpanElement>
> & {
    Content: typeof Content
    Trigger: typeof Trigger
}

const Collapsible = _Collapsible as CompoundedComponent

Collapsible.Content = Content
Collapsible.Trigger = Trigger

export { Collapsible }

export default Collapsible
