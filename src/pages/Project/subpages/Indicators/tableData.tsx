import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {ColumnsType} from "antd/es/table";
import {Button, Popconfirm, Tag} from "antd";
import {getIndicatorStatus} from "../../../../utils/getIndicatorStatus";
import {DeleteOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

export interface ITableDataType {
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

export const getColumns = (
    onDelete: (id: number) => void,
    projectEditable: boolean,
    projectId: string | number,
    currentUserCanEdit: boolean,
) => {
    const defaultColumns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 250,
            ...getColumnSearch('name', 'Поиск по наименованию показателя'),
            render: (_, {name, key}) => {
                return <Link to={'/project/' + projectId + '/indicator/' + key + '/info'}>
                    {name}
                </Link>
            }
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
    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit
        ?
        [...defaultColumns,
            {
                key: 'action',
                render: (record) => (
                    <Popconfirm
                        title="Удаление показателя"
                        description="Вы уверены, что хотите удалить показатель?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onDelete(record.key)}
                    >
                        <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                )
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}