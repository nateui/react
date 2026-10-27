import classNames from '@/utils/class-names'
import { useConfig, CONTROL_SIZES } from '../config-provider/index'
import { useForm, useFormField } from '../form/context'
import type { TypeAttributes } from '../config-provider/types'
import type { ComponentProps, MouseEvent, ReactNode, Ref } from 'react'

export type InputWrapperProps = Omit<ComponentProps<'span'>, 'prefix'> & {
    disabled?: boolean
    invalid?: boolean
    prefix?: ReactNode
    readOnly?: boolean
    ref?: Ref<HTMLSpanElement>
    size?: TypeAttributes.ControlSize
    suffix?: ReactNode
}

const InputWrapper = (props: InputWrapperProps) => {
    const {
        children,
        className,
        disabled,
        invalid,
        onClick,
        prefix,
        readOnly,
        ref,
        size,
        suffix,
        ...rest
    } = props

    const { classNames: configClassNames, componentDefaults, direction } =
        useConfig()
    const inputClassNames = configClassNames?.input
    const formControlSize = useForm()?.size
    const formFieldInvalid = useFormField()?.invalid

    const inputSize =
        size ?? formControlSize ?? componentDefaults?.input?.size ?? 'md'
    const isInputInvalid = invalid || formFieldInvalid

    const inputSizeClass = classNames(
        `input-${inputSize}`,
        CONTROL_SIZES[inputSize].h,
        inputSize === 'lg' && 'text-lg',
        inputSize === 'sm' && 'text-xs rounded-control-sm py-1',
    )
    const inputFocusClass =
        'input-focus focus-within:ring-control-focus focus-within:border-control-focus'

    const wrapperClass = classNames(
        'input input-wrapper group/input border border-control-border bg-control rounded-control w-full flex items-center gap-2 px-3 shadow-control focus-within:outline-none focus-within:ring-1 focus-within:bg-control transition duration-150 text-control-foreground ease-in-out',
        inputSizeClass,
        !isInputInvalid && !readOnly && inputFocusClass,
        disabled &&
            'input-disabled bg-control-disabled text-control-disabled-foreground !cursor-not-allowed',
        isInputInvalid &&
            'input-invalid border-destructive bg-destructive-soft focus-within:ring-1 focus-within:ring-destructive focus-within:border-destructive focus-within:bg-transparent',
        direction === 'rtl' && 'flex-row-reverse',
        inputClassNames?.root,
        className,
    )
    const affixClass = classNames(
        'flex shrink-0 items-center whitespace-nowrap text-control-foreground h-full',
        disabled && 'text-control-disabled-foreground',
        isInputInvalid && 'text-destructive',
    )

    const handleWrapperClick = (event: MouseEvent<HTMLSpanElement>) => {
        const input = event.currentTarget.querySelector<
            HTMLInputElement | HTMLTextAreaElement
        >('input, textarea')
        const target = event.target as Element

        if (
            input &&
            target !== input &&
            !target.closest('button, a') &&
            !input.disabled
        ) {
            input.focus()
            input.click()
            return
        }

        onClick?.(event)
    }

    return (
        <span
            ref={ref}
            {...rest}
            className={wrapperClass}
            data-disabled={disabled ? '' : undefined}
            data-invalid={isInputInvalid ? '' : undefined}
            data-readonly={readOnly ? '' : undefined}
            onClick={handleWrapperClick}
        >
            {prefix ? (
                <span
                    className={classNames(
                        'input-suffix-start',
                        affixClass,
                        inputClassNames?.prefix,
                    )}
                >
                    {prefix}
                </span>
            ) : null}
            {children}
            {suffix ? (
                <span
                    className={classNames(
                        'input-suffix-end',
                        affixClass,
                        inputClassNames?.suffix,
                    )}
                >
                    {suffix}
                </span>
            ) : null}
        </span>
    )
}

export default InputWrapper
