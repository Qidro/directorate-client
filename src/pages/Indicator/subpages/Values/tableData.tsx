import {Button, Popconfirm, Space, Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {getIndicatorStatus} from "../../../../utils/getIndicatorStatus";
import dayjs from "dayjs";
import { IProjectIndicator } from "../../../../types/indicator";

export interface ITableDataType {
    key: number
    period: string,
    plan_value: number,
    forecast_value: number,
    actual_value: number
    status: string
}

export const getColumns = (
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    indicator: IProjectIndicator,
    projectEditable: boolean,
    currentUserCanEdit: boolean,
) => {
    const defaultColumns = [
        {
            key: 'period',
            dataIndex: 'period',
            title: 'Период',
            width: 185,
            render: (_, {period}) => {
                const format = indicator.evaluation_frequency === 'MONTH'
                    ? 'MM.YYYY'
                    : indicator.evaluation_frequency === 'QUARTER'
                        ? 'MM.YYYY'
                        : 'YYYY'
                return dayjs(period).format(format)
            },
        },
        {
            key: 'plan_value',
            dataIndex: 'plan_value',
            title: 'План',
            width: 185,
        },
        {
            key: 'forecast_value',
            dataIndex: 'forecast_value',
            title: 'Прогноз',
            width: 185,
        },
        {
            key: 'actual_value',
            dataIndex: 'actual_value',
            title: 'Факт',
            width: 185,
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            width: 185,
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

    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit
        ?
        [...defaultColumns,
            {
                key: 'action',
                width: 65,
                render: (record) => (
                    <Space>
                        <Button type='dashed' onClick={() => { onEdit(record.key)}} icon={<EditOutlined/>} ></Button>
                        <Popconfirm
                            title="Удаление значения показателя"
                            description="Вы уверены, что хотите удалить значение показателя?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => onDelete(record.key)}
                        >
                            <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                        </Popconfirm>
                    </Space>
                ),
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}