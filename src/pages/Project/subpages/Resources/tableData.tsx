import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {ColumnsType} from "antd/es/table"
import {IResourceCP, IResourceWorking} from "../../../../types/resource";

export const getColumnsWorking = () => {
    return [
        {
            key: 'fullname',
            dataIndex: 'fullname',
            title: 'ФИО',
            width: 300,
            ...getColumnSearch('name', 'Поиск по ФИО'),
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'Должность',
            width: 300,
        },
        {
            key: 'role_name',
            dataIndex: 'role_name',
            title: 'Роли в проекте',
            width: 300,
            render: (_, record) => {
                return record.roles.map(role => role.name).toString()
            }
        },
        {
            key: 'role_description',
            dataIndex: 'role_description',
            title: 'Выполняемый функционал',
            width: 300,
            render: (_, record) => {
                return record.roles.map(role => role.description).toString()
            }
        },
    ] as ColumnsType<IResourceWorking>
}

export const getColumnsCP = () => {
    return [
        {
            key: 'fullname',
            dataIndex: 'fullname',
            title: 'ФИО',
            width: 300,
            ...getColumnSearch('name', 'Поиск по ФИО'),
        },
        {
            key: 'role_name',
            dataIndex: 'role_name',
            title: 'Роль',
            width: 300,
        },
        {
            key: 'task',
            dataIndex: 'task',
            title: 'Задача',
            width: 300,
        },
        {
            key: 'dates',
            dataIndex: 'dates',
            title: 'Дата',
            width: 300,
        },
    ] as ColumnsType<IResourceCP>
}