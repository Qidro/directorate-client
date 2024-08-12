import {IUserRole} from "../../../../../../types/role";
import {getColumnSearch} from "../../../../../../utils/getColumnSearch";
import {getProjectStage} from "../../../../../../utils/getProjectStage";
import {Button, Space, Tag, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import {RollbackOutlined} from "@ant-design/icons";
import React from "react";
import {getColumnDateSorter} from "../../../../../../utils/getColumnDateSorter";

export interface ITableData {
    key: number;
    name: string;
    start_date: string;
    end_date: string;
    stage: 'INITIATION' | 'PREPARATION' | 'REALIZATION' | 'COMPLETION' | 'POST_PROJECT_MONITORING' | 'ARCHIVED' | 'CANCELED',
    director?: IUserRole;
    admins?: IUserRole[],
    curator?: IUserRole
}

export const getColumns = (
    onRestore: (id: number) => void
) => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            ...getColumnSearch('name', 'Поиск по наименованию и номеру проекта')
        },
        {
            key: 'start_date',
            dataIndex: 'start_date',
            title: 'Начало',
            width: 150,
            ...getColumnDateSorter('start_date')
        },
        {
            key: 'end_date',
            dataIndex: 'end_date',
            title: 'Окончание',
            width: 150,
            ...getColumnDateSorter('end_date')
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
                return record.stage === value
            },
            render: (_, {stage}) => {
                const newStage = getProjectStage(stage)
                return <Tag color={'#' + newStage[1]}>{newStage[0]}</Tag>
            },
        },
        {
            key: 'director',
            dataIndex: 'director',
            title: 'Руководитель',
            width: 300,
            ...getColumnSearch('director', 'Поиск по руководителю'),
            render: (_, {director}) => (director ? director.fullname : 'Не назначен')
        },
        {
            key: 'admins',
            dataIndex: 'admins',
            title: 'Куратор от ИД',
            width: 300,
            ...getColumnSearch('admins', 'Поиск по куратору от ИД'),
            render: (_, {admins}) => {
                return admins && admins.length > 0 ? <>
                    {admins.map(item => (
                        <div key={item.id}>{item.fullname}</div>
                    ))}
                </> : 'Не назначены'
            }
        },
        {
            key: 'curator',
            dataIndex: 'curator',
            title: 'Куратор',
            width: 300,
            ...getColumnSearch('curator', 'Поиск по куратору'),
            render: (_, {curator}) => curator ? curator.fullname : 'Не назначен'
        },
        {
            key: 'action',
            width: '1%',
            render: (_, record) => (
                <Space>
                    <Tooltip title='Восстановить проект'>
                        <Button type='dashed' icon={<RollbackOutlined />} onClick={() => onRestore(record.key)}/>
                    </Tooltip>
                </Space>
            ),
        }
    ] as ColumnsType<ITableData>
}