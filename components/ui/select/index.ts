import type { ReactElement, RefAttributes } from 'react'
import _Select from './select'
import type { SelectProps } from './select'
import Multi from './multi'
import ValueWithPrefix from './value-with-prefix'
import OptionWithPrefix from './option-with-prefix'

export type { SelectProps } from './select'
export type { ValueWithPrefixProps } from './value-with-prefix'
export type { OptionWithPrefixProps } from './option-with-prefix'

type CompoundedComponent = (<T = object>(
    props: SelectProps<T> & RefAttributes<HTMLSpanElement>,
) => ReactElement) & {
    Multi: typeof Multi
    ValueWithPrefix: typeof ValueWithPrefix
    OptionWithPrefix: typeof OptionWithPrefix
}

const Select = _Select as unknown as CompoundedComponent

Select.Multi = Multi
Select.ValueWithPrefix = ValueWithPrefix
Select.OptionWithPrefix = OptionWithPrefix

export { Select }
export default Select
