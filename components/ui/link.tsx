import classNames from '@/utils/class-names'
import { useConfig } from './config-provider/index'
import type {
    ComponentPropsWithRef,
    ElementType,
} from 'react'

export type LinkRenderProps = Omit<
    ComponentPropsWithRef<'a'>,
    'href'
> & {
    href: string
}

export type LinkRenderer = ElementType<LinkRenderProps>

export type LinkProps = LinkRenderProps & {
    render?: LinkRenderer
    resetDefaultClass?: boolean
}

const Link = ({
    children,
    className,
    href,
    ref,
    rel,
    render: Renderer,
    target,
    resetDefaultClass,
    ...rest
}: LinkProps) => {
    const { classNames: configClassNames } = useConfig()
    const linkClassNames = configClassNames?.link
    const resolvedRel =
        target === '_blank' && !rel ? 'noopener noreferrer' : rel

    const linkProps: LinkRenderProps = {
        ...rest,
        children,
        className: classNames(
            !resetDefaultClass &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:underline underline-offset-4',
            linkClassNames?.root,
            className,
        ),
        href,
        ref,
        rel: resolvedRel,
        target,
    }

    return Renderer ? <Renderer {...linkProps} /> : <a {...linkProps} />
}

export default Link
