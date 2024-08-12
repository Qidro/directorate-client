import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {Button, Popconfirm, Space} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {Link} from "react-router-dom";
import {costsName, fundingSource} from "../../../../constants/budget";

export interface ITableDataType {
    key: number,
    stage: {
        id: number,
        name: string,
    },
    funding_source: string,
    costs_name: string,
    spending_costs: number,
}

export const getColumns = (
    onEdit: (id: number) => void,
    onRemove: (id: number) => void,
    projectEditable: boolean,
    projectId: string | number,
    currentUserCanEdit: boolean
) => {
    const defaultColumns = [
        {
            key: 'stage',
            dataIndex: 'stage',
            title: 'Этап',
            ...getColumnSearch('stage', 'Поиск по наименованию этапа'),
            render: (_, {stage}) => {
                return <Link to={'/project/' + projectId + '/calendar_plan/' + stage.id + '/info'}>
                    {stage.name}
                </Link>
            }
        },
        {
            key: 'funding_source',
            dataIndex: 'funding_source',
            title: 'Источник финансирования',
            filters: [
                {text: 'Собственный средства УГМУ', value: 'OWN_FUNDS'},
                {text: 'Финансирование из "Приоритет 2030"', value: 'PRIORITY_FUNDING'},
                {text: 'Иное финансирование', value: 'OTHER_FUNDING'},
            ],
            onFilter: (value: any, record) => {
                return record.funding_source === value
            },
            render: (_, {funding_source}) => {
                return <>{fundingSource[funding_source].text}</>
            }
        },
        {
            key: 'costs_name',
            dataIndex: 'costs_name',
            title: 'Строка расхода',
            filters: [
                {text: 'Заработная плата', value: 'WAGE'},
                {text: 'Накладные расходы', value: 'OVERHEADS'},
                {text: 'Оборудование', value: 'EQUIPMENT'},
                {text: 'Программное обеспечение', value: 'SOFTWARE'},
                {text: 'Расходные материалы', value: 'CONSUMABLES'},
                {text: 'Командировки', value: 'BUSINESS_TRIPS'},
                {text: 'Обучение', value: 'EDUCATION'},
            ],
            onFilter: (value: any, record) => {
                return record.costs_name === value
            },
            render: (_, {costs_name}) => {
                return <>{costsName[costs_name].text}</>
            }
        },
        {
            key: 'spending_costs',
            dataIndex: 'spending_costs',
            title: 'Затраты',
        }
    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit
        ?
        [...defaultColumns,
            {
                key: 'action',
                width: 50,
                render: (record) => (
                    <Space>
                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => onEdit(record.key)}></Button>
                        <Popconfirm
                            title="Удаление строки расхода"
                            description="Вы уверены, что хотите удалить строку расхода?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => onRemove(record.key)}
                        >
                            <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                        </Popconfirm>
                    </Space>
                ),
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}