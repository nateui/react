import { useConfig } from '../config-provider/index'
import classNames from '@/utils/class-names'

const Total = (props: { total: number }) => {
    const { total } = props
    const { classNames: configClassNames } = useConfig()
    const paginationClassNames = configClassNames?.pagination

    return (
        <div
            className={classNames(
                'pagination-total font-medium mr-2',
                paginationClassNames?.total,
            )}
        >
            Total <span>{total}</span> Items
        </div>
    )
}

export default Total
