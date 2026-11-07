import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ComponentProps } from 'react'

const ListElement = ({ className, ...rest }: ComponentProps<'li'>) => {
    const { classNames: configClassNames } = useConfig()
    const selectClassNames = configClassNames?.select

    return (
        <li
            {...rest}
            className={classNames(
                'select-item px-2 h-9 rounded-control-sm flex justify-between items-center cursor-auto text-popover-foreground font-medium',
                selectClassNames?.item,
                className,
            )}
        />
    )
}

export default ListElement
