import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Slider from './slider'
import type { SliderProps } from './slider'
import RangeSlider from './range-slider'

export type { SliderProps, SliderVariant } from './slider'
export type { RangeSliderProps } from './range-slider'

type CompoundedComponent = ForwardRefExoticComponent<
    SliderProps & RefAttributes<HTMLSpanElement>
> & {
    Range: typeof RangeSlider
}

const Slider = _Slider as CompoundedComponent

Slider.Range = RangeSlider

export { Slider }

export default Slider
