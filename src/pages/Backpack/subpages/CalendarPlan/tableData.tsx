import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {getProjectStage} from "../../../../utils/getProjectStage";
import {Table, TableColumnsType, Tag, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import React from "react";
import {Link} from "react-router-dom";
import {IBackpackProjectCalendarPlan} from "../../../../types/backpack";
import {ICalendarPlan} from "../../../../types/calendarPlan";
import {IUserRole} from "../../../../types/role";
import {getCPStatus} from "../../../../utils/getCPStatus";
import dayjs from "dayjs";
import {getApprovalDoc} from "../../../../utils/getApprovalDoc";
import {getColumnDateSorter} from "../../../../utils/getColumnDateSorter";

export interface IExpandedTableDataType {
    id: number
    name: string,
    status: 'IN_WORK' | 'COMPLETE' | 'CONFIRMED' | 'OVERDUE' | 'FORECAST_FAILURE',
    type: string,
    start_date_plan: string,
    start_date_forecast: string,
    start_date_fact: string,
    length_of_days?: number,
    working_days?: number,
    end_date_plan: string,
    end_date_forecast: string,
    end_date_fact: string,
    approval_doc: string,
    users: IUserRole[],
}

const plansToTable = (plans: ICalendarPlan[]): IExpandedTableDataType[] => {
    return plans.map(plan => ({
        key: plan.id,
        id: plan.id,
        name: plan.name,
        status: plan.status,
        type: plan.type,
        start_date_plan: plan.start_date_plan,
        start_date_forecast: plan.start_date_forecast,
        start_date_fact: plan.start_date_fact,
        length_of_days: plan.length_of_days,
        working_days: plan.working_days,
        end_date_plan: plan.end_date_plan,
        end_date_forecast: plan.end_date_forecast,
        end_date_fact: plan.end_date_fact,
        approval_doc: plan.approval_doc,
        users: plan.users,
        children: plan.children
    }))
}

export const getExpandedTable = (record: IBackpackProjectCalendarPlan) => {
    const columns: TableColumnsType<IExpandedTableDataType> = [
        {
            key: 'type',
            dataIndex: 'type',
            title: 'Тип',
            render: (value) => (
                <Tooltip title={value === 'WORK' ? 'Работа' : value === 'STAGE' ? 'Этап' : 'Контрольная точка'}>
                    <Tag color={value === 'WORK' ? '#5A97F2' : value === 'STAGE' ? '#5A97F2' : '#00B7F4'}
                         style={{marginInlineEnd: 0}}>
                        {value === 'WORK' ? 'Р' : value === 'STAGE' ? 'Э' : 'К'}
                    </Tag>
                </Tooltip>
            )
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            ...getColumnSearch('name', 'Поиск по наименованию точки'),
            render: (_, {name, id}) => {
                return <Link to={'/project/' + record.id + '/calendar_plan/' + id + '/info'}>
                    {name}
                </Link>
            }
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            filters: [
                {text: 'В работе', value: 'IN_WORK'},
                {text: 'Выполнена', value: 'COMPLETE'},
                {text: 'Подтверждена', value: 'CONFIRMED'},
                {text: 'Просрочена', value: 'OVERDUE'},
                {text: 'Возможен срыв сроков', value: 'FORECAST_FAILURE'}
            ],
            render: (_, {status}) => {
                const newStatus = getCPStatus(status)
                return <Tag color={'#' + newStatus[1]} style={{marginInlineEnd: 0}}>
                    {newStatus[0]}
                </Tag>
            },
            onFilter: (value: any, record) => {
                return record.status === value
            }
        },
        {
            key: 'start_date_plan',
            dataIndex: 'start_date_plan',
            title: 'Начало (план)',
            width: 120,
            ...getColumnDateSorter('start_date_plan'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'start_date_forecast',
            dataIndex: 'start_date_forecast',
            title: 'Начало (прогноз)',
            width: 120,
            ...getColumnDateSorter('start_date_forecast'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'start_date_fact',
            dataIndex: 'start_date_fact',
            title: 'Начало (факт)',
            width: 120,
            ...getColumnDateSorter('start_date_fact'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'length_of_days',
            dataIndex: 'length_of_days',
            title: 'Количество дней',
            width: 150
        },
        {
            key: 'working_days',
            dataIndex: 'working_days',
            title: 'Количество рабочих дней',
            width: 150
        },
        {
            key: 'end_date_plan',
            dataIndex: 'end_date_plan',
            title: 'Конец (план)',
            width: 120,
            ...getColumnDateSorter('end_date_plan'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'end_date_forecast',
            dataIndex: 'end_date_forecast',
            title: 'Конец (прогноз)',
            width: 120,
            ...getColumnDateSorter('end_date_forecast'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'end_date_fact',
            dataIndex: 'end_date_fact',
            title: 'Конец (факт)',
            width: 120,
            ...getColumnDateSorter('end_date_fact'),
            render: (value) => value ? dayjs(value).format('DD.MM.YYYY') : null
        },
        {
            key: 'users',
            dataIndex: 'users',
            title: 'Исполнитель',
            render: (_, {users}) => {
                return <>
                    {users.filter(item => item.role.slug === 'EXECUTOR').length > 0
                        ?
                        users.filter(item => item.role.slug === 'EXECUTOR').map(item => (
                            <div key={item.id}>{item.fullname}</div>
                        ))
                        : 'Не назначен'
                    }
                </>
            }
        },
        {
            key: 'approval_doc',
            dataIndex: 'approval_doc',
            title: 'Утверждающий документ',
            render: (_, {approval_doc}) => {
                return (
                    <div>{getApprovalDoc(approval_doc)}</div>
                )
            }
        },
    ]
    return <Table columns={columns}
                  scroll={{x: 'max-content'}}
                  dataSource={plansToTable(record.calendar_plans)}
                  pagination={false}
                  rowKey='id'
                  bordered/>;
}

export const getColumns = () => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            ...getColumnSearch('name', 'Поиск по наименованию и номеру проекта'),
            render: (_, {name, id}) => <Link to={'/project/' + id + '/info'}>{name}</Link>
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
                return record.status === value
            },
            render: (_, {status}) => {
                const newStage = getProjectStage(status)
                return <Tag color={'#' + newStage[1]}>{newStage[0]}</Tag>
            },
        },
    ] as ColumnsType<IBackpackProjectCalendarPlan>
}