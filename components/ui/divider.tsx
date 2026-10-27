import classNames from '@/utils/class-names'

type DividerProps = {
    orientation?: 'horizontal' | 'vertical'
    className?: string
    dashed?: boolean
}

const Divider = ({
    orientation = 'horizontal',
    className = '',
    dashed
}: DividerProps) => {
    const orientationClasses =
        orientation === 'vertical' ? 'w-px h-full mx-2' : 'h-px w-full my-2'

    return (
        <div
            className={classNames(
                dashed ? 'text-border bg-[linear-gradient(90deg,currentcolor_4px,transparent_4px)] bg-[length:10px_1px] bg-center bg-repeat-x' : 'bg-border',
                orientationClasses,
                className,
            )}
            role="separator"
            
        />
    )
}

export default Divider
