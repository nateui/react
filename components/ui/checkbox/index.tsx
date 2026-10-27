import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Checkbox from './checkbox'
import type { CheckboxProps } from './checkbox'
import CheckboxGroup from './group'

export type { CheckboxProps } from './checkbox'
export type { CheckboxGroupProps } from './group'
export type { CheckboxGroupValue, CheckboxValue } from './context'

type CompoundedComponent = ForwardRefExoticComponent<
    CheckboxProps & RefAttributes<HTMLInputElement>
> & {
    Group: typeof CheckboxGroup
}

const Checkbox = _Checkbox as CompoundedComponent

Checkbox.Group = CheckboxGroup

export { Checkbox }

export default Checkbox
