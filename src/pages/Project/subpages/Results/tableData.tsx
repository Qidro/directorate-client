import {ColumnsType} from "antd/es/table";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {Button, Popconfirm, Tag} from "antd";
import React from "react";
import {getResultStatus} from "../../../../utils/getResultStatus";
import {DeleteOutlined} from "@ant-design/icons";
import {IUserRole} from "../../../../types/role";
import {Link} from "react-router-dom";

export interface ITableDataType {
    key: number
    name: string,
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ACHIEVED' | 'CANCELED',
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
            ...getColumnSearch('name', 'Поиск по наименованию результата'),
            render: (_, {name, key}) => {
                return <Link to={'/project/' + projectId + '/result/' + key + '/info'}>
                    {name}
                </Link>
            }
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            filters: [
                {text: 'Выполняется', value: 'IN_PROGRESS'},
                {text: 'Выполнен', value: 'COMPLETED'},
                {text: 'Достигнут', value: 'ACHIEVED'}
            ],
            render: (_, {status}) => {
                const newStatus = getResultStatus(status)
                return <Tag color={'#' + newStatus[1]}>{newStatus[0]}</Tag>
            },
            onFilter: (value: any, record) => {
                return record.status === value
            },
            width: 200
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
                        title="Удаление результата"
                        description="Вы уверены, что хотите удалить результат?"
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