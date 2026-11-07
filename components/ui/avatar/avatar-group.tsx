'use client'

import { Children, cloneElement, Fragment } from 'react'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import Avatar from './avatar'
import Tooltip from '../tooltip'
import type { AvatarProps } from './avatar'
import type { ReactNode, ReactElement, ComponentProps } from 'react'
import type { TooltipProps } from '../tooltip'

export type AvatarGroupProps = ComponentProps<'div'> & {
    chained?: boolean
    maxCount?: number
    onOmittedAvatarClick?: () => void
    omittedAvatarContent?: string | ReactNode
    omittedAvatarProps?: AvatarProps
    omittedAvatarTooltip?: boolean
    omittedAvatarTooltipProps?: Omit<TooltipProps, 'title'>
}

interface GroupContainerProps
    extends Omit<AvatarGroupProps, 'chained'>, Pick<AvatarGroupProps, 'chained'> {}

const GroupContainer = ({
    children,
    chained,
    className,
}: GroupContainerProps) => {
    const { classNames: configClassNames } = useConfig()
    const avatarClassNames = configClassNames?.avatar

    return (
        <div
            className={classNames(
                'avatar-group inline-flex',
                chained &&
                    'avatar-group-chained [&>.avatar]:-ml-2 [&>.tooltip-wrapper]:-ml-2 rtl:[&>.avatar]:-mr-2 rtl:[&>.tooltip-wrapper]:-mr-2 [&>.avatar:first-child]:ml-0 [&>.tooltip-wrapper:first-child]:ml-0 rtl:[&>.avatar:first-child]:mr-0 rtl:[&>.tooltip-wrapper:first-child]:mr-0',
                avatarClassNames?.group,
                className,
            )}
        >
            {children}
        </div>
    )
}

const AvatarGroup = (props: AvatarGroupProps) => {
    const {
        chained: chainedProp,
        children,
        className,
        maxCount = 4,
        onOmittedAvatarClick,
        omittedAvatarContent,
        omittedAvatarProps,
        omittedAvatarTooltip = false,
        omittedAvatarTooltipProps,
    } = props
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const avatarClassNames = configClassNames?.avatar
    const chained =
        chainedProp ?? componentDefaults?.avatarGroup?.chained ?? false

    const childCount = Children.count(children)

    const childWithKey = Children.toArray(children).map((child, index) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cloneElement(child as ReactElement<any>, {
            key: `grouped-avatar-${index}`,
        }),
    )

    if (maxCount && maxCount < childCount) {
        const childToShow = childWithKey.slice(0, maxCount)
        const overflowCount = childCount - maxCount
        const avatar = (
            <Avatar shape="round"
                {...omittedAvatarProps}
                className={classNames(
                    avatarClassNames?.overflow,
                    onOmittedAvatarClick ? 'cursor-pointer' : '',
                    omittedAvatarProps?.className,
                )}
                onClick={() => onOmittedAvatarClick?.()}
            >
                {omittedAvatarContent || `+${overflowCount}`}
            </Avatar>
        )

        childToShow.push(
            omittedAvatarTooltip ? (
                <Tooltip
                    key="avatar-more-tooltip"
                    title={`${overflowCount} More`}
                    {...omittedAvatarTooltipProps}
                >
                    <>{avatar}</>
                </Tooltip>
            ) : (
                <Fragment key="avatar-more-tooltip">{avatar}</Fragment>
            ),
        )
        return (
            <GroupContainer className={className} chained={chained}>
                {childToShow}
            </GroupContainer>
        )
    }

    return (
        <GroupContainer className={className} chained={chained}>
            {children}
        </GroupContainer>
    )
}

export default AvatarGroup
