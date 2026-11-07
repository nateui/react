import classNames from '@/utils/class-names'
import { useConfig, CONTROL_SIZES } from '../config-provider/index'
import { useForm } from '../form/context'
import { useInputGroup } from './context'
import type { TypeAttributes } from '../config-provider/types'
import type { Ref, ComponentProps } from 'react'

export interface AddonProps extends ComponentProps<'div'> {
    size?: TypeAttributes.ControlSize
    ref?: Ref<HTMLDivElement>
}

const Addon = ({ ref, ...props }: AddonProps) => {
    const { size, children, className } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const inputGroupClassNames = configClassNames?.inputGroup
    const formControlSize = useForm()?.size
    const inputGroupSize = useInputGroup()?.size

    const inputAddonSize =
        size ??
        inputGroupSize ??
        formControlSize ??
        componentDefaults?.inputGroup?.size ??
        'md'

    const addonClass = classNames(
        'input-addon flex items-center px-4 rounded-control border bg-muted',
        `input-addon-${inputAddonSize} ${CONTROL_SIZES[inputAddonSize].h}`,
        inputGroupClassNames?.addon,
        className,
    )

    return (
        <div ref={ref} className={addonClass}>
            {children}
        </div>
    )
}

export default Addon
