import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {getProjectStage} from "../../../../utils/getProjectStage";
import {Table, TableColumnsType, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {Link} from "react-router-dom";
import {getIndicatorStatus} from "../../../../utils/getIndicatorStatus";
import {IBackpackProjectIndicator} from "../../../../types/backpack";
import {IProjectIndicator} from "../../../../types/indicator";

export interface IExpandedTableDataType {
    key: number
    name: string,
    units_measure: string,
    plan_value: string,
    forecast_value: string,
    actual_value: string
    base_value: string,
    responsible_user?: string
    status: string
}

const indicatorToTable = (indicators: IProjectIndicator[]): IExpandedTableDataType[] => {
    return indicators.map(indicator => {
        return {
            key: indicator.id,
            name: indicator.name,
            units_measure: indicator.units_measure,
            plan_value: indicator.plan_value,
            forecast_value: indicator.forecast_value,
            actual_value: indicator.actual_value,
            base_value: indicator.base_value,
            responsible_user: indicator.users.find(user => user.role.slug === 'RESPONSIBLE')?.fullname,
            status: indicator.status
        }
    })
}

export const getExpandedTable = (record: IBackpackProjectIndicator) => {
    const columns: TableColumnsType<IExpandedTableDataType> = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 250,
            ...getColumnSearch('name', 'Поиск по наименованию показателя'),
            render: (_, {name, key}) => <Link to={'/indicator/' + key + '/info'}>{name}</Link>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            width: 120,
            render: (_, {status}) => {
                const newStatus = getIndicatorStatus(status)
                return <Tag color={'#' + newStatus[1]}>{newStatus[0]}</Tag>
            },
            filters: [
                {text: 'Ожидается', value: 'AWAITING'},
                {text: 'Достигнут', value: 'ACHIEVED'},
                {text: 'Срыв', value: 'DISRUPTION'},
            ],
            onFilter: (value: any, record) => {
                return record.status === value
            },
        },
        {
            key: 'units_measure',
            dataIndex: 'units_measure',
            title: 'Единица измерения',
            width: 200,
        },
        {
            key: 'plan_value',
            dataIndex: 'plan_value',
            title: 'План',
            width: 80,
        },
        {
            key: 'forecast_value',
            dataIndex: 'forecast_value',
            title: 'Прогноз',
            width: 80
        },
        {
            key: 'actual_value',
            dataIndex: 'actual_value',
            title: 'Факт',
            width: 80,
        },
        {
            key: 'base_value',
            dataIndex: 'base_value',
            title: 'Базовое значение',
            width: 80
        },
        {
            key: 'responsible_user',
            dataIndex: 'responsible_user',
            title: 'Ответственный',
            width: 250,
        },
    ]

    return <Table columns={columns} dataSource={indicatorToTable(record.indicators)} pagination={false} rowKey='id'
                  bordered/>;
}

export const getColumns = () => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            ...getColumnSearch('name', 'Поиск по наименованию и номеру проекта'),
            render: (_, {name, id}) => <Link to={'/project/' + id + '/info'}>{name}</Link>
        },
        {
            key: 'stage',
            dataIndex: 'stage',
            title: 'Стадия',
            width: 250,
            filters: [
                {text: 'Инициирование', value: 'INITIATION'},
                {text: 'Подготовка', value: 'PREPARATION'},
                {text: 'Реализация', value: 'REALIZATION'},
                {text: 'Заверешение', value: 'COMPLETION'},
                {text: 'Постпроектный мониторинг', value: 'POST-PROJECT MONITORING'},
                {text: 'Отменен', value: 'CANCELED'},
            ],
            onFilter: (value: any, record) => {
                return record.status === value
            },
            render: (_, {status}) => {
                const newStage = getProjectStage(status)
                return <Tag color={'#' + newStage[1]}>{newStage[0]}</Tag>
            },
        },
    ] as ColumnsType<IBackpackProjectIndicator>
}