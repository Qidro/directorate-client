import {ColumnsType} from "antd/es/table";
import {User} from "../../../../types/user";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {Button, Popconfirm, Space} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";


export const getColumns = (
    onEdit: (id: string) => void,
    onDelete: (id: string) => void,
    userId: string
) => {
    return [
        {
            title: 'ФИО',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '20%',
            ...getColumnSearch('fullname', 'Поиск по ФИО')
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
            ...getColumnSearch('email', 'Поиск по почте')
        },
        {
            title: 'Отдел',
            dataIndex: 'departmentName',
            key: 'departmentName',
            ...getColumnSearch('departmentName', 'Поиск по отделу')
        },
        {
            title: 'Должность',
            dataIndex: 'positionName',
            key: 'positionName',
            ...getColumnSearch('positionName', 'Поиск по должности'),
        },
        {
            key: 'action',
            width: '5%',
            render: (record) => (
                <Space>
                    <Button type='dashed' onClick={() => onEdit(record.key)} icon={<EditOutlined/>} />
                    {userId !== record.key && (
                        <Popconfirm
                            title="Удаление пользователя"
                            description="Вы уверены, что хотите удалить данного пользователя?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => onDelete(record.key)}
                        >
                            <Button danger type='primary' icon={<DeleteOutlined/>} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        }
    ] as ColumnsType<User>
}