import _Radio from './radio'
import type { RadioProps } from './radio'
import Group from './group'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type { RadioProps } from './radio'
export type { RadioGroupProps } from './group'

type CompoundedComponent = ForwardRefExoticComponent<
    RadioProps & RefAttributes<HTMLInputElement>
> & {
    Group: typeof Group
}

const Radio = _Radio as CompoundedComponent

Radio.Group = Group

export { Radio }

export default Radio
