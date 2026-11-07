import Button from '../button'
import { ChevronLeft } from '../icons/index'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useCarousel } from './context'
import type { ComponentPropsWithoutRef } from 'react'

export type CarouselPreviousProps = Omit<
    ComponentPropsWithoutRef<typeof Button>,
    'icon' | 'shape' | 'aria-label'
>

const CarouselPrevious = (props: CarouselPreviousProps) => {
    const { className, variant = 'default', size = 'sm', ...rest } = props
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()
    const { classNames: configClassNames } = useConfig()
    const carouselClassNames = configClassNames?.carousel

    const buttonClass = classNames(
        orientation === 'vertical' && 'rotate-90',
        carouselClassNames?.previousTrigger,
        className,
    )

    return (
        <Button
            variant={variant}
            size={size}
            className={buttonClass}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            clickFeedback={false}
            shape="circle"
            aria-label="Previous slide"
            icon={<ChevronLeft />}
            {...rest}
        />
    )
}

export default CarouselPrevious
