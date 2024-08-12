import {IUserRole} from "../../../../types/role";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {Button, Popconfirm, Tag, Tooltip} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {getCPStatus} from "../../../../utils/getCPStatus";
import {getApprovalDoc} from "../../../../utils/getApprovalDoc";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {ICalendarPlan} from "../../../../types/calendarPlan";
import {getColumnDateSorter} from "../../../../utils/getColumnDateSorter";

export interface ITableDataType {
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
    children?: ICalendarPlan[]
}

export const getColumns = (
    onRemove: (id: number) => void,
    projectEditable: boolean,
    projectId: number,
    currentUserCanEdit: boolean
) => {
    const defaultColumns = [
        {
            key: 'type',
            dataIndex: 'type',
            title: 'Тип',
            fixed: 'left',
            render: (value) => {
                return (
                    <Tooltip title={value === 'WORK' ? 'Работа' : value === 'STAGE' ? 'Этап' : 'Контрольная точка'}>
                        <Tag color={value === 'WORK' ? '#5A97F2' : value === 'STAGE' ? '#5A97F2' : '#00B7F4'}
                             style={{marginInlineEnd: 0}}>
                            {value === 'WORK' ? 'Р' : value === 'STAGE' ? 'Э' : 'К'}
                        </Tag>
                    </Tooltip>
                )
            }
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            fixed: 'left',
            ...getColumnSearch('name', 'Поиск по наименованию точки'),
            render: (_, {name, id}) => {
                return <Link to={'/project/' + projectId + '/calendar_plan/' + id + '/info'}>
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
    ] as ColumnsType<ITableDataType>

    return projectEditable && currentUserCanEdit
        ?
        [...defaultColumns,
            {
                key: 'action',
                width: 50,
                render: (record) => (
                    <Popconfirm
                        title="Удаление точки/этапа/работы"
                        description="Вы уверены, что хотите удалить точку/этап/работу?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onRemove(record.id)}
                    >
                        <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                ),
            }
        ] as ColumnsType<ITableDataType>
        : defaultColumns
}