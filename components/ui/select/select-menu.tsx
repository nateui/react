import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import { forwardRef } from 'react'
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react'

type SelectMenuProps = {
    children: ReactNode
    isOpen: boolean
    style?: CSSProperties
    role?: string
    'aria-labelledby'?: string
    'aria-multiselectable'?: boolean
    id?: string
    'aria-activedescendant'?: string
    onKeyDown?: (event: KeyboardEvent<HTMLUListElement>) => void
}

const SelectMenu = forwardRef<HTMLUListElement, SelectMenuProps>(
    (props, ref) => {
        const { isOpen, children, style, ...rest } = props
        const { classNames: configClassNames } = useConfig()
        const selectClassNames = configClassNames?.select

        return (
            <ul
                ref={ref}
                className={classNames(
                    'select-menu-wrapper absolute w-full z-popover',
                    selectClassNames?.menuWrapper,
                )}
                style={style}
                {...rest}
            >
                {isOpen && (
                    <div
                        className={classNames(
                            'select-menu bg-popover text-popover-foreground rounded-popover my-2 min-h-[50px] border shadow-popover w-full max-h-[300px] overflow-hidden',
                            selectClassNames?.menu,
                        )}
                    >
                        {children}
                    </div>
                )}
            </ul>
        )
    },
)

SelectMenu.displayName = 'SelectMenu'

export default SelectMenu
