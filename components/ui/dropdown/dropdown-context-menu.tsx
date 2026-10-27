import { DropdownContextProvider } from './context/dropdown-context'
import DropdownContextArea from './dropdown-context-area'
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react'
import type {
    DropdownContextAreaProps,
    DropdownContextAreaRef,
} from './dropdown-context-area'
import type { HTMLProps, Ref } from 'react'

export type DropdownContextMenuRef = DropdownContextAreaRef
export type DropdownContextMenuProps = DropdownContextAreaProps & {
    eventKey?: string
    id?: string
    ref?: Ref<DropdownContextMenuRef>
}

const DropdownContextMenu = ({
    activeKey,
    ref,
    ...props
}: DropdownContextAreaProps & Omit<HTMLProps<HTMLElement>, 'ref'>) => {
    const parentId = useFloatingParentNodeId()

    if (parentId === null) {
        return (
            <DropdownContextProvider value={{ activeKey }}>
                <FloatingTree>
                    <DropdownContextArea {...props} ref={ref} />
                </FloatingTree>
            </DropdownContextProvider>
        )
    }

    return <DropdownContextArea {...props} ref={ref} />
}

export default DropdownContextMenu
