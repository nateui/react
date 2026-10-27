import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type { ComponentPropsWithRef, MouseEvent } from 'react'

export type CardHeaderProps = ComponentPropsWithRef<'div'> & {
    bordered?: boolean
}

export type CardBodyProps = ComponentPropsWithRef<'div'>

export type CardFooterProps = ComponentPropsWithRef<'div'> & {
    bordered?: boolean
}

export type CardProps = ComponentPropsWithRef<'div'> & {
    clickable?: boolean
    bordered?: boolean
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const CardHeader = ({
    bordered: borderedProp,
    children,
    className,
    ref,
    ...rest
}: CardHeaderProps) => {
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const bordered = borderedProp ?? componentDefaults?.card?.bordered ?? true
    const cardClassNames = configClassNames?.card

    return (
        <div
            ref={ref}
            {...rest}
            className={classNames(
                'card-header py-2 px-4',
                bordered && 'card-header-border border-b rounded-t-card',
                cardClassNames?.header,
                className,
            )}
        >
            {children}
        </div>
    )
}

const CardBody = ({ children, className, ref, ...rest }: CardBodyProps) => {
    const { classNames: configClassNames } = useConfig()
    const cardClassNames = configClassNames?.card

    return (
        <div
            ref={ref}
            {...rest}
            className={classNames('card-body p-4', cardClassNames?.body, className)}
        >
            {children}
        </div>
    )
}

const CardFooter = ({
    bordered: borderedProp,
    children,
    className,
    ref,
    ...rest
}: CardFooterProps) => {
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const bordered = borderedProp ?? componentDefaults?.card?.bordered ?? true
    const cardClassNames = configClassNames?.card

    return (
        <div
            ref={ref}
            {...rest}
            className={classNames(
                'card-footer rounded-bl-card rounded-br-card py-2 px-4',
                bordered && 'card-footer-border border-t border-card-border',
                cardClassNames?.footer,
                className,
            )}
        >
            {children}
        </div>
    )
}

const CardBase = (props: CardProps) => {
    const {
        children,
        className,
        clickable = false,
        bordered: borderedProp,
        ref,
        onClick,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const bordered = borderedProp ?? componentDefaults?.card?.bordered ?? true
    const cardClassNames = configClassNames?.card

    const cardClass = classNames(
        'card bg-card rounded-card',
        bordered
            ? 'border border-card-border'
            : 'shadow-card border-b border-card-border',
        clickable && 'cursor-pointer user-select-none',
        cardClassNames?.root,
        className,
    )

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        onClick?.(e)
    }

    return (
        <div
            ref={ref}
            className={cardClass}
            role="presentation"
            onClick={handleClick}
            {...rest}
        >
            {children}
        </div>
    )
}

const Card = Object.assign(CardBase, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
})

export default Card

export { Card, CardBase, CardHeader, CardBody, CardFooter }
