import {IUserRole} from "../../../../types/role";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {Button, Popconfirm, Tag} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {getContractStage} from "../../../../utils/getContractStage";
import {Link} from "react-router-dom";

export interface ITableDataType {
    key: number
    name: string,
    status: 'INITIATION' | 'DOC_PREPARED' | 'COMPETITIVE_PROCEDURES' | 'SIGNING' | 'EXECUTED',
    plannedCost: number,
    cost: number,
    paid: number,
    responsibleUsers?: IUserRole[]
}

export const getColumns = (
    onRemove: (id: number) => void,
    projectEditable: boolean,
    projectId: string | number,
    currentUserCanEdit: boolean,
) => {
    const defaultColumns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            ...getColumnSearch('name', 'Поиск по наименованию контракта'),
            render: (_, {name, key}) => {
                return <Link to={'/project/' + projectId + '/contract/' + key + '/info'}>
                    {name}
                </Link>
            }
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            filters: [
                {text: 'Инициирование', value: 'INITIATION'},
                {text: 'Готовятся документы', value: 'DOC_PREPARED'},
                {text: 'Проводятся конкурсные процедуры', value: 'COMPETITIVE_PROCEDURES'},
                {text: 'Заключается', value: 'SIGNING'},
                {text: 'Исполняется', value: 'EXECUTED'}
            ],
            render: (_, {status}) => {
                const newStatus = getContractStage(status)
                return <Tag color={'#' + newStatus[1]}>{newStatus[0]}</Tag>
            },
            onFilter: (value: any, record) => {
                return record.status === value
            },
            width: 200
        },
        {
            key: 'plannedCost',
            dataIndex: 'plannedCost',
            title: 'Планируемая стоимость',
        },
        {
            key: 'cost',
            dataIndex: 'cost',
            title: 'Стоимость',
        },
        {
            key: 'paid',
            dataIndex: 'paid',
            title: 'Оплачено',
        },
        {
            key: 'responsibleUsers',
            dataIndex: 'responsibleUsers',
            title: 'Ответственные',
            ...getColumnSearch('responsibleUsers', 'Поиск по ответственным'),
            onFilter: (value, record) => {
                const users = record.responsibleUsers?.filter(item => (
                    item.fullname.toLowerCase().includes(value.toString().toLowerCase())
                ))
                return users ? users.length > 0 : false
            },
            render: (_, {responsibleUsers}) => {
                return responsibleUsers && responsibleUsers.length > 0 ? <>
                    {responsibleUsers.map(item => (
                        <div key={item.id}>{item.fullname}</div>
                    ))}
                </> : 'Не назначены'
            }
        },
    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit
        ?
        [...defaultColumns,
            {
                key: 'action',
                width: 50,
                render: (record) => (
                    <Popconfirm
                        title="Удаление контракта"
                        description="Вы уверены, что хотите удалить контракт?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onRemove(record.key)}
                    >
                        <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                ),
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}