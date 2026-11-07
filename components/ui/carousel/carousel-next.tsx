import Button from '../button'
import { ChevronRight } from '../icons/index'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useCarousel } from './context'
import type { ComponentPropsWithoutRef } from 'react'

export type CarouselNextProps = Omit<
    ComponentPropsWithoutRef<typeof Button>,
    'icon' | 'shape' | 'aria-label'
>

const CarouselNext = (props: CarouselNextProps) => {
    const { className, variant = 'default', size = 'sm', ...rest } = props
    const { orientation, scrollNext, canScrollNext } = useCarousel()
    const { classNames: configClassNames } = useConfig()
    const carouselClassNames = configClassNames?.carousel

    const buttonClass = classNames(
        orientation === 'vertical' && 'rotate-90',
        carouselClassNames?.nextTrigger,
        className,
    )

    return (
        <Button
            variant={variant}
            size={size}
            className={buttonClass}
            disabled={!canScrollNext}
            clickFeedback={false}
            onClick={scrollNext}
            shape="circle"
            aria-label="Next slide"
            icon={<ChevronRight />}
            {...rest}
        />
    )
}

export default CarouselNext
