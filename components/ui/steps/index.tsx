import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Steps from './steps'
import type { StepsProps } from './steps'
import StepItem from './step-item'

export type { StepsProps } from './steps'
export type { StepItemProps } from './types'

type CompoundedComponent = ForwardRefExoticComponent<
    StepsProps & RefAttributes<HTMLDivElement>
> & {
    Item: typeof StepItem
}

const Steps = _Steps as CompoundedComponent

Steps.Item = StepItem

export { Steps }

export default Steps
