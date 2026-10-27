import { Unsort, SortUp, SortDown } from '../icons/index'
import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'

export type SorterProps = {
    className?: string
    sort?: boolean | 'asc' | 'desc'
}

const Sorter = ({ sort, className }: SorterProps) => {
    const { classNames: configClassNames } = useConfig()
    const tableClassNames = configClassNames?.table

    const renderSort = () => {
        if (typeof sort === 'boolean') {
            return <Unsort className={tableClassNames?.sorterIcon} />
        }

        if (sort === 'asc') {
            return (
                <SortUp
                    className={classNames(tableClassNames?.sorterIcon)}
                />
            )
        }

        if (sort === 'desc') {
            return (
                <SortDown
                    className={classNames(tableClassNames?.sorterIcon)}
                />
            )
        }

        return null
    }

    return (
        <div className={classNames('inline-flex', tableClassNames?.sorter, className)}>
            {renderSort()}
        </div>
    )
}

export default Sorter
