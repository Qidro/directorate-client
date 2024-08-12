import {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";
import {Button, Popconfirm, Space} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export interface ITableDataType {
    key: number
    achievementDate: string,
    unitsMeasure: string,
    planValue: number,
    forecastValue: number
}

export const getColumns = (
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    projectEditable: boolean,
    currentUserCanEdit: boolean,
    resultNoAchieved: boolean,
) => {
    const defaultColumns = [
        {
            key: 'achievementDate',
            dataIndex: 'achievementDate',
            title: 'Дата достижения',
            render: (_, {achievementDate}) => {
                return dayjs(achievementDate).isValid() ? dayjs(achievementDate).format('DD.MM.YYYY') : ''
            }
        },
        {
            key: 'unitsMeasure',
            dataIndex: 'unitsMeasure',
            title: 'Ед. измерения'
        },
        {
            key: 'planValue',
            dataIndex: 'planValue',
            title: 'План'
        },
        {
            key: 'forecastValue',
            dataIndex: 'forecastValue',
            title: 'Факт/Прогноз'
        },
    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit && resultNoAchieved
        ?
        [...defaultColumns,
            {
                key: 'action',
                width: 65,
                render: (record) => (
                    <Space>
                        <Button type='dashed' onClick={() => onEdit(record.key)} icon={<EditOutlined/>} ></Button>
                        <Popconfirm
                            title="Удаление значения результата"
                            description="Вы уверены, что хотите удалить значение результата?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => onDelete(record.key)}
                        >
                            <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                        </Popconfirm>
                    </Space>
                )
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}