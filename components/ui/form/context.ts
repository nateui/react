import { createContext, useContext } from 'react'
import type { TypeAttributes } from '../config-provider/types'

export type FormContextProps = {
    size?: TypeAttributes.ControlSize
    layout?: TypeAttributes.FormLayout
    labelWidth?: string | number
}

const FormContext = createContext<FormContextProps | null>(null)

export const FormContextProvider = FormContext.Provider

export const FormContextConsumer = FormContext.Consumer

export function useForm() {
    return useContext(FormContext)
}

export type FormFieldContextProps = {
    controlId?: string
    labelId?: string
    hintId?: string
    errorId?: string
    describedBy?: string
    invalid?: boolean
}

const FormFieldContext = createContext<FormFieldContextProps | null>(null)

export const FormFieldContextProvider = FormFieldContext.Provider

export const FormFieldContextConsumer = FormFieldContext.Consumer

export function useFormField() {
    return useContext(FormFieldContext)
}

export function mergeDescribedBy(
    ...values: Array<string | null | undefined>
) {
    const ids = values
        .flatMap((value) => value?.split(/\s+/) ?? [])
        .filter(Boolean)

    return ids.length > 0 ? Array.from(new Set(ids)).join(' ') : undefined
}

export default FormContext
