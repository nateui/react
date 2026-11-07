import FormRoot from './form'
import FormField from './form-field'
import FormScope from './form-scope'

export type { FormProps } from './form'
export type { FormFieldProps } from './form-field'
export type { FormScopeProps } from './form-scope'

type CompoundedComponent = typeof FormRoot & {
    Root: typeof FormRoot
    Field: typeof FormField
    Scope: typeof FormScope
}

const Form = FormRoot as CompoundedComponent

Form.Root = FormRoot
Form.Field = FormField
Form.Scope = FormScope

export { Form, FormRoot, FormField, FormScope }

export default Form
