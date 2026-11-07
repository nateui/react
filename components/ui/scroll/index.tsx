import type { ForwardRefExoticComponent } from 'react'
import _Scroll from './scroll'
import type { ScrollProps } from './scroll'
import ScrollFlexSize from './scroll-flex-size'

export type { ScrollProps } from './scroll'
export type { ScrollFlexSizeProps } from './scroll-flex-size'

type CompoundedComponent = ForwardRefExoticComponent<ScrollProps> & {
    FlexSize: typeof ScrollFlexSize
}

const Scroll = _Scroll as CompoundedComponent

Scroll.FlexSize = ScrollFlexSize

export { Scroll }

export default Scroll
