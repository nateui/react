import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Avatar from './avatar'
import type { AvatarProps } from './avatar'
import AvatarGroup from './avatar-group'

export type { AvatarProps } from './avatar'
export type { AvatarGroupProps } from './avatar-group'

type CompoundedComponent = ForwardRefExoticComponent<
    AvatarProps & RefAttributes<HTMLSpanElement>
> & {
    Group: typeof AvatarGroup
}

const Avatar = _Avatar as CompoundedComponent

Avatar.Group = AvatarGroup

export { Avatar }

export default Avatar
