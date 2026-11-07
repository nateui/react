import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Carousel from './carousel'
import type { CarouselProps } from './carousel'
import CarouselContent from './carousel-content'
import CarouselItem from './carousel-item'
import CarouselPrevious from './carousel-previous'
import CarouselNext from './carousel-next'

export type { CarouselProps } from './carousel'
export type { CarouselContentProps } from './carousel-content'
export type { CarouselItemProps } from './carousel-item'
export type { CarouselPreviousProps } from './carousel-previous'
export type { CarouselNextProps } from './carousel-next'
export type { CarouselApi, CarouselOrientation } from './context'

type CompoundedComponent = ForwardRefExoticComponent<
    CarouselProps & RefAttributes<HTMLDivElement>
> & {
    Content: typeof CarouselContent
    Item: typeof CarouselItem
    Previous: typeof CarouselPrevious
    Next: typeof CarouselNext
}

const Carousel = _Carousel as CompoundedComponent

Carousel.Content = CarouselContent
Carousel.Item = CarouselItem
Carousel.Previous = CarouselPrevious
Carousel.Next = CarouselNext

export { Carousel }

export default Carousel
