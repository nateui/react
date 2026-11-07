import type { ReactNode, ComponentPropsWithRef } from 'react'

export type StepStatus = 'complete' | 'pending' | 'in-progress' | 'error'

export type StepItemProps = Omit<ComponentPropsWithRef<'div'>, 'title' > & {
    customIcon?: ReactNode | string
    description?: ReactNode | string
    isLast?: boolean
    onStepChange?: () => void
    status?: StepStatus
    stepNumber?: number
    title?: ReactNode | string
    vertical?: boolean
}