import classNames from '@/utils/class-names'
import { useConfig, CONTROL_SIZES } from '../config-provider/index'
import { mergeDescribedBy, useForm, useFormField } from '../form/context'
import InputWrapper from './input-wrapper'
import type { TypeAttributes } from '../config-provider/types'
import type {
    InputHTMLAttributes,
    ElementType,
    ReactNode,
    HTMLInputTypeAttribute,
    ClassAttributes,
    Ref,
    ComponentProps,
} from 'react'

type InputElement = HTMLInputElement | HTMLTextAreaElement

export type InputProps = Omit<ComponentProps<'input'>, 'size' | 'prefix'> &
    Omit<
        InputHTMLAttributes<InputElement | HTMLTextAreaElement>,
        'size' | 'prefix'
    > & {
    disabled?: boolean
    invalid?: boolean
    prefix?: string | ReactNode
    rows?: number
    ref?: Ref<ElementType | InputElement>
    size?: TypeAttributes.ControlSize
    suffix?: string | ReactNode
    textArea?: boolean
    type?: HTMLInputTypeAttribute
    'data-state'?: string
}

const Input = (props: InputProps) => {
    const {
        className,
        disabled,
        id: idProp,
        invalid,
        prefix,
        size,
        suffix,
        textArea,
        type = 'text',
        ref,
        rows,
        style,
        readOnly,
        'aria-describedby': ariaDescribedByProp,
        'aria-invalid': ariaInvalidProp,
        'data-state': dataState,
        ...rest
    } = props
    const ariaLabelProp = props['aria-label']
    const ariaLabelledByProp = props['aria-labelledby']

    const { classNames: configClassNames, componentDefaults } = useConfig()
    const inputClassNames = configClassNames?.input
    const formControlSize = useForm()?.size
    const formField = useFormField()
    const formFieldInvalid = formField?.invalid

    const inputSize =
        size ?? formControlSize ?? componentDefaults?.input?.size ?? 'md'

    const isInputInvalid = invalid || formFieldInvalid
    const inputId = idProp ?? formField?.controlId
    const ariaDescribedBy = mergeDescribedBy(
        ariaDescribedByProp,
        formField?.describedBy,
    )
    const ariaLabelledBy =
        ariaLabelledByProp ?? (!ariaLabelProp ? formField?.labelId : undefined)

    const fixControlledValue = (
        val: string | number | readonly string[] | undefined,
    ) => {
        if (typeof val === 'undefined' || val === null) {
            return ''
        }
        return val
    }

    if ('value' in props) {
        rest.value = fixControlledValue(props.value)
        delete rest.defaultValue
    }

    const inputDefaultClass = 'input border border-control-border bg-control rounded-control w-full py-1.5 shadow-control focus:outline-none focus:ring-1 focus-within:ring-1 focus:bg-control appearance-none transition duration-150 text-control-foreground read-only:focus:ring-0 ease-in-out placeholder:text-muted-foreground px-3'

    const inputSizeClass = classNames(
        `input-${inputSize}`,
        CONTROL_SIZES[inputSize].h,
        inputSize === 'lg' && 'text-base',
        inputSize === 'sm' && 'rounded-control-sm py-1',
    )
    const inputFocusClass = `input-focus focus:ring-control-focus focus-within:ring-control-focus focus-within:border-control-focus focus:border-control-focus`
    const inputClass = classNames(
        inputDefaultClass,
        inputSizeClass,
        !isInputInvalid && !readOnly && inputFocusClass,
        disabled &&
            'input-disabled bg-control-disabled text-control-disabled-foreground !cursor-not-allowed placeholder:text-control-disabled-foreground',
        isInputInvalid &&
            'input-invalid focus:ring-1 focus:ring-destructive border-destructive focus:bg-transparent bg-destructive-soft focus-within:ring-1 focus-within:ring-destructive focus-within:border-destructive focus-within:bg-transparent placeholder:text-destructive',
        textArea && `input-textarea min-h-28 ${inputClassNames?.textarea}`,
        inputClassNames?.control,
        !prefix && !suffix ? inputClassNames?.root : '',
        !prefix && !suffix ? className : '',
    )
    const affixInputClass = classNames(
        'input-control h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-inherit placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:bg-transparent disabled:cursor-not-allowed disabled:text-control-disabled-foreground disabled:placeholder:text-control-disabled-foreground read-only:focus:ring-0',
        inputSize === 'lg' && 'text-base',
        isInputInvalid && 'placeholder:text-destructive',
        inputClassNames?.control,
    )

    const inputProps = {
        ...rest,
        className: inputClass,
        disabled,
        id: inputId,
        'data-disabled': disabled ? '' : undefined,
        'data-invalid': isInputInvalid ? '' : undefined,
        'data-state': dataState,
        ...(ariaDescribedBy !== undefined
            ? { 'aria-describedby': ariaDescribedBy }
            : {}),
        ...(isInputInvalid || ariaInvalidProp !== undefined
            ? {
                  'aria-invalid': isInputInvalid
                      ? true
                      : ariaInvalidProp,
              }
            : {}),
        ...(ariaLabelledBy !== undefined
            ? { 'aria-labelledby': ariaLabelledBy }
            : {}),
        readOnly,
        type,
        ref,
    }

    const renderTextArea = (
        <textarea
            style={style}
            rows={rows}
            {...(inputProps as ClassAttributes<HTMLTextAreaElement>)}
        ></textarea>
    )

    const renderInput = (
        <input
            style={style}
            {...inputProps}
        />
    )

    const renderAffixInput = (
        <InputWrapper
            className={className}
            disabled={disabled}
            invalid={isInputInvalid}
            prefix={prefix}
            readOnly={readOnly}
            size={inputSize}
            suffix={suffix}
            style={style}
            data-state={dataState}
        >
            <input {...inputProps} className={affixInputClass} />
        </InputWrapper>
    )

    const renderChildren = () => {
        if (textArea) {
            return renderTextArea
        }

        if (prefix || suffix) {
            return renderAffixInput
        } else {
            return renderInput
        }
    }

    return renderChildren()
}

export default Input
