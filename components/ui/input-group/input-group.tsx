import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { useForm } from '../form/context'
import { InputGroupContextProvider, InputGroupContextConsumer } from './context'
import type { Ref, ComponentProps } from 'react'
import type { TypeAttributes } from '../config-provider/types'

export interface InputGroupProps extends ComponentProps<'div'> {
    size?: TypeAttributes.ControlSize
    ref?: Ref<HTMLDivElement>
}

const InputGroup = ({ ref, ...props }: InputGroupProps) => {
    const { children, className, size } = props

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const inputGroupClassNames = configClassNames?.inputGroup
    const formControlSize = useForm()?.size

    const inputGroupSize =
        size ?? formControlSize ?? componentDefaults?.inputGroup?.size

    const inputGroupClass = classNames(
        'input-group flex items-center',
        '[&_.input:focus]:z-30 [&_.input:focus-within]:z-30 [&_.date-picker]:z-[11] [&_.select]:z-20 [&_.select.select-menu-open]:z-30 [&_.date-picker.picker-expanded]:z-20 [&_.input-suffix-end]:z-20 [&_.input-suffix-start]:z-20',
        'ltr:[&>.input:first-child]:!rounded-r-none rtl:[&>.input:first-child]:!rounded-l-none ltr:[&>.input-addon:first-child]:!rounded-r-none rtl:[&>.input-addon:first-child]:!rounded-l-none ltr:[&>.select:first-child]:!rounded-r-none rtl:[&>.select:first-child]:!rounded-l-none ltr:[&>.button:first-child]:!rounded-r-none rtl:[&>.button:first-child]:!rounded-l-none',
        'ltr:[&>.input:last-child:not(.picker)]:!rounded-l-none rtl:[&>.input:last-child:not(.picker)]:!rounded-r-none ltr:[&>.input-addon:last-child:not(.picker)]:!rounded-l-none rtl:[&>.input-addon:last-child:not(.picker)]:!rounded-r-none ltr:[&>.select:last-child:not(.picker)]:!rounded-l-none rtl:[&>.select:last-child:not(.picker)]:!rounded-r-none ltr:[&>.button:last-child:not(.picker)]:!rounded-l-none rtl:[&>.button:last-child:not(.picker)]:!rounded-r-none',
        'ltr:[&>.input:not(:first-child)]:!rounded-l-none ltr:[&>.input:not(:first-child)]:!-ml-px rtl:[&>.input:not(:first-child)]:!rounded-r-none rtl:[&>.input:not(:first-child)]:!-mr-px ltr:[&>.input-addon:not(:first-child)]:!rounded-l-none ltr:[&>.input-addon:not(:first-child)]:!-ml-px rtl:[&>.input-addon:not(:first-child)]:!rounded-r-none rtl:[&>.input-addon:not(:first-child)]:!-mr-px ltr:[&>.select:not(:first-child)]:!rounded-l-none ltr:[&>.select:not(:first-child)]:!-ml-px rtl:[&>.select:not(:first-child)]:!rounded-r-none rtl:[&>.select:not(:first-child)]:!-mr-px ltr:[&>.button:not(:first-child)]:!rounded-l-none ltr:[&>.button:not(:first-child)]:!-ml-px rtl:[&>.button:not(:first-child)]:!rounded-r-none rtl:[&>.button:not(:first-child)]:!-mr-px',
        'ltr:[&>.input:not(:last-child)]:!rounded-r-none rtl:[&>.input:not(:last-child)]:!rounded-l-none ltr:[&>.input-addon:not(:last-child)]:!rounded-r-none rtl:[&>.input-addon:not(:last-child)]:!rounded-l-none ltr:[&>.select:not(:last-child)]:!rounded-r-none rtl:[&>.select:not(:last-child)]:!rounded-l-none ltr:[&>.button:not(:last-child)]:!rounded-r-none rtl:[&>.button:not(:last-child)]:!rounded-l-none',
        'ltr:[&>*:first-child_.input]:rounded-r-none rtl:[&>*:first-child_.input]:rounded-l-none ltr:[&>*:first-child_.select]:rounded-r-none rtl:[&>*:first-child_.select]:rounded-l-none ltr:[&>*:last-child_.input]:rounded-l-none rtl:[&>*:last-child_.input]:rounded-r-none ltr:[&>*:last-child_.select]:rounded-l-none rtl:[&>*:last-child_.select]:rounded-r-none',
        'ltr:[&>*:not(:first-child)_.input]:rounded-l-none ltr:[&>*:not(:first-child)_.input]:-ml-px rtl:[&>*:not(:first-child)_.input]:rounded-r-none rtl:[&>*:not(:first-child)_.input]:-mr-px ltr:[&>*:not(:first-child)_.select__control]:rounded-l-none ltr:[&>*:not(:first-child)_.select__control]:-ml-px rtl:[&>*:not(:first-child)_.select__control]:rounded-r-none rtl:[&>*:not(:first-child)_.select__control]:-mr-px',
        'ltr:[&>*:not(:last-child)_.input]:rounded-r-none rtl:[&>*:not(:last-child)_.input]:rounded-l-none ltr:[&>*:not(:last-child)_.select]:rounded-r-none rtl:[&>*:not(:last-child)_.select]:rounded-l-none [&>.button]:z-10 hover:[&>.button]:z-20',
        inputGroupClassNames?.root,
        className,
    )

    const contextValue = {
        size: inputGroupSize,
    }
    return (
        <InputGroupContextProvider value={contextValue}>
            <InputGroupContextConsumer>
                {() => {
                    return (
                        <div ref={ref} className={inputGroupClass}>
                            {children}
                        </div>
                    )
                }}
            </InputGroupContextConsumer>
        </InputGroupContextProvider>
    )
}

export default InputGroup
