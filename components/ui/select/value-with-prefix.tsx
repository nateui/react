import type { ReactNode } from 'react'

export type ValueWithPrefixProps = {
    label: ReactNode
    prefix?: ReactNode
    showPrefix?: boolean
}

const ValueWithPrefix = ({
    prefix,
    label,
    showPrefix = true,
}: ValueWithPrefixProps) => {
    return (
        <div className="flex items-center flex-1 gap-2 h-full relative">
            {showPrefix && (
                <span className="h-full flex items-center justify-center z-0">
                    {prefix}
                </span>
            )}
            {label}
        </div>
    )
}

export default ValueWithPrefix
