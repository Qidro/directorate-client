import {ColumnsType} from "antd/es/table";
import {User} from "../../../../../../types/user";
import {getColumnSearch} from "../../../../../../utils/getColumnSearch";
import {Button, Space, Tooltip} from "antd";
import {RollbackOutlined} from "@ant-design/icons";
import React from "react";

export const getColumns = (
    onRestore: (id: string) => void,
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
                    <Tooltip title='Восстановить пользователя'>
                        <Button type='dashed' icon={<RollbackOutlined />} onClick={() => onRestore(record.key)}/>
                    </Tooltip>
                </Space>
            ),
        }
    ] as ColumnsType<User>
}