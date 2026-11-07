import classNames from '@/utils/class-names'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import { useForm, FormFieldContextProvider } from './context'
import { useConfig, CONTROL_SIZES } from '../config-provider/index'
import { LAYOUT } from './constants'
import type { TypeAttributes } from '../config-provider/types'
import type { ReactNode, Ref, ComponentProps } from 'react'

export type FormFieldProps = ComponentProps<'div'> & {
    asterisk?: boolean
    errorMessage?: string
    extra?: string | ReactNode
    hint?: string | ReactNode
    htmlFor?: string
    invalid?: boolean
    label?: string | ReactNode
    labelClass?: string
    labelWidth?: string | number
    labelId?: string
    layout?: TypeAttributes.FormLayout
    ref?: Ref<HTMLDivElement>
    size?: TypeAttributes.ControlSize
}

const FormField = (props: FormFieldProps) => {
    const {
        asterisk,
        children,
        className,
        errorMessage,
        extra,
        hint,
        htmlFor,
        invalid,
        label,
        labelClass,
        labelId,
        labelWidth,
        layout,
        ref,
        style,
        size,
        ...rest
    } = props

    const formContext = useForm()
    const generatedId = useId()
    const controlId = htmlFor ?? `${generatedId}-control`
    const hasLabel = label !== undefined && label !== null && label !== ''
    const resolvedLabelId =
        labelId ?? (hasLabel ? `${generatedId}-label` : undefined)
    const hintId = `${generatedId}-hint`
    const errorId = `${generatedId}-error`
    const { classNames: configClassNames, componentDefaults } = useConfig()
    const formFieldClassNames = configClassNames?.formField

    const formFieldLabelHeight =
        size ?? formContext?.size ?? componentDefaults?.form?.size ?? 'md'
    const formFieldLabelWidth = labelWidth || formContext?.labelWidth
    const formFieldLayout = layout || formContext?.layout || 'vertical'

    const getFormLabelLayoutClass = () => {
        switch (formFieldLayout) {
            case LAYOUT.HORIZONTAL:
                return label
                    ? `${CONTROL_SIZES[formFieldLabelHeight].h} ${
                          label && 'ltr:pr-2 rtl:pl-2'
                      }`
                    : 'ltr:pr-2 rtl:pl-2'
            case LAYOUT.VERTICAL:
                return `mb-1`
            case LAYOUT.INLINE:
                return `${CONTROL_SIZES[formFieldLabelHeight].h} ${
                    label && 'ltr:pr-2 rtl:pl-2'
                }`
            default:
                return ''
        }
    }

    const formFieldClass = classNames(
        'form-field group/form-field mb-7 relative',
        formFieldLayout,
        formFieldLayout === LAYOUT.HORIZONTAL && 'flex flex-auto',
        formFieldLayout === LAYOUT.VERTICAL && 'flex flex-col',
        formFieldLayout === LAYOUT.INLINE && 'md:!inline-flex mr-3 rtl:ml-3',
        formFieldClassNames?.root,
        className,
        invalid ? 'invalid' : '',
    )

    const formLabelClass = classNames(
        'form-label flex items-center gap-1 font-medium text-foreground',
        label ? getFormLabelLayoutClass() : '',
        invalid && 'invalid text-destructive',
        formFieldClassNames?.label,
        labelClass,
    )

    const formLabelStyle = () => {
        if (formFieldLayout === LAYOUT.HORIZONTAL) {
            return { ...style, ...{ minWidth: formFieldLabelWidth } }
        }

        return { ...style }
    }

    const reduceMotion = useReducedMotion()
    const enterStyle = { opacity: 1, marginTop: 3 }
    const exitStyle = reduceMotion
        ? { opacity: 0, marginTop: 3 }
        : { opacity: 0, marginTop: -10 }
    const initialStyle = exitStyle
    const fieldMessage = invalid && errorMessage ? errorMessage : hint
    const fieldMessageInvalid = Boolean(invalid && errorMessage)
    const fieldMessageId = fieldMessageInvalid ? errorId : hintId
    const describedBy = fieldMessage ? fieldMessageId : undefined

    return (
        <FormFieldContextProvider
            value={{
                controlId,
                labelId: resolvedLabelId,
                hintId,
                errorId,
                describedBy,
                invalid,
            }}
        >
            <div
                ref={ref}
                className={formFieldClass}
                data-invalid={invalid ? '' : undefined}
                {...rest}
            >
                <label
                    id={resolvedLabelId}
                    htmlFor={controlId}
                    className={formLabelClass}
                    style={formLabelStyle()}
                >
                    {asterisk && (
                        <span
                            className={classNames(
                                'text-destructive',
                                formFieldClassNames?.asterisk,
                            )}
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                    {label}
                    {extra}
                    {label && formFieldLayout !== 'vertical' && ':'}
                </label>
                <div
                    className={
                        classNames(
                            formFieldLayout === LAYOUT.HORIZONTAL
                                ? 'w-full flex flex-col justify-center relative'
                                : '',
                            formFieldClassNames?.control,
                        )
                    }
                >
                    {children}
                    <AnimatePresence mode="wait">
                        {fieldMessage && (
                            <motion.div
                                key="field-message"
                                id={fieldMessageId}
                                className={classNames(
                                    'form-explain text-xs absolute font-medium',
                                    fieldMessageInvalid
                                        ? 'text-destructive'
                                        : 'text-muted-foreground',
                                    formFieldClassNames?.message,
                                )}
                                initial={initialStyle}
                                animate={enterStyle}
                                exit={exitStyle}
                                transition={{
                                    duration: reduceMotion ? 0.01 : 0.15,
                                    type: 'tween',
                                }}
                            >
                                {fieldMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </FormFieldContextProvider>
    )
}

export default FormField
