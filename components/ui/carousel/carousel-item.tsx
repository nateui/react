import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useCarousel } from './context'
import type { Ref, ComponentProps } from 'react'

export type CarouselItemProps = ComponentProps<'div'> & {
    ref?: Ref<HTMLDivElement>
}

const CarouselItem = (props: CarouselItemProps) => {
    const { className, children, ref, ...rest } = props
    const { orientation } = useCarousel()
    const { classNames: configClassNames } = useConfig()
    const carouselClassNames = configClassNames?.carousel

    const itemClass = classNames(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'px-2' : 'py-2',
        carouselClassNames?.item,
        className,
    )

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={itemClass}
            {...rest}
        >
            {children}
        </div>
    )
}

export default CarouselItem
