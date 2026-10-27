import { FormContextProvider, FormContextConsumer } from './context'
import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'
import { LAYOUT } from './constants'
import type { FormContextProps } from './context'
import type { TypeAttributes } from '../config-provider/types'
import type { ComponentProps } from 'react'

export type FormScopeProps = ComponentProps<'div'> & {
    size?: TypeAttributes.ControlSize
    layout?: TypeAttributes.FormLayout
    labelWidth?: string | number
}

const FormScope = (props: FormScopeProps) => {
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const formScopeClassNames = configClassNames?.formScope

    const {
        children,
        className,
        labelWidth = 100,
        layout = LAYOUT.VERTICAL,
        size,
    } = props

    const contextValue = {
        labelWidth,
        layout,
        size: size ?? componentDefaults?.form?.size,
    }

    return (
        <FormContextProvider value={contextValue as FormContextProps}>
            <FormContextConsumer>
                {(context) => {
                    return (
                        <div
                            className={classNames(
                                'form-scope',
                                context?.layout,
                                context?.layout === LAYOUT.INLINE &&
                                    'inline md:!flex items-center',
                                formScopeClassNames?.root,
                                className,
                            )}
                        >
                            {children}
                        </div>
                    )
                }}
            </FormContextConsumer>
        </FormContextProvider>
    )
}

FormScope.displayName = 'FormScope'

export default FormScope
