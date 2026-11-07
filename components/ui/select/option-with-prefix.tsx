import type { ReactNode } from 'react'

export type OptionWithPrefixProps = {
    prefix?: ReactNode
    label: ReactNode
    selected?: boolean
    checkIcon?: ReactNode
}

const OptionWithPrefix = ({
    prefix,
    selected,
    label,
    checkIcon,
}: OptionWithPrefixProps) => {
    return (
        <>
            <div className="flex items-center gap-2">
                {prefix}
                {label}
            </div>
            {selected ? checkIcon : null}
        </>
    )
}

export default OptionWithPrefix
