import FormScope from './form-scope'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { FormScopeProps } from './form-scope'

export type FormProps = ComponentPropsWithoutRef<'form'> &
    FormScopeProps & {
        containerClassName?: string
        ref?: Ref<HTMLFormElement>
    }

export const Form = (props: FormProps) => {
    const {
        children,
        className,
        containerClassName,
        labelWidth,
        layout,
        size,
        ref,
        ...rest
    } = props
    const { classNames: configClassNames } = useConfig()
    const formClassNames = configClassNames?.form

    return (
        <form
            ref={ref}
            className={classNames(formClassNames?.root, className)}
            {...rest}
        >
            <FormScope
                className={containerClassName}
                labelWidth={labelWidth}
                layout={layout}
                size={size}
            >
                {children}
            </FormScope>
        </form>
    )
}

export default Form
