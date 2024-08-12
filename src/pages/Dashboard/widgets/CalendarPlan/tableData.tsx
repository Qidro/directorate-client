import {ColumnsType} from "antd/es/table";
import {calendarPlanStatus} from "../../../../types/calendarPlan";
import {Link} from "react-router-dom";
import {getCPStatus} from "../../../../utils/getCPStatus";
import {Tag, Tooltip} from "antd";
import {getColumnSearch} from "../../../../utils/getColumnSearch";

export interface ITableDataType {
    key: number;
    id: number;
    name: string;
    type: string;
    status: calendarPlanStatus;
    projectId: number;
    projectName: string;
    endDate: string;
}

export const columns: ColumnsType<ITableDataType> = [
    {
        key: 'type',
        dataIndex: 'type',
        fixed: 'left',
        width: 40,
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
        key: 'project',
        title: 'Проект',
        width: '25%',
        render: (_, {projectId, projectName}) => (
            <Link to={`/project/${projectId}/calendar_plan`}>
                {projectName}
            </Link>
        ),
        ...getColumnSearch('projectName', 'Поиск по проекту'),
    },
    {
        key: 'name',
        title: 'Событие',
        width: '30%',
        render: (_, {projectId, name, id}) => (
            <Link to={`/project/${projectId}/calendar_plan/${id}/info`}>{name}</Link>
        ),
        ...getColumnSearch('name', 'Поиск по наименованию точки'),
    },
    {
        key: 'status',
        title: 'Статус',
        width: '25%',
        filters: [
            {text: 'В работе', value: 'IN_WORK'},
            {text: 'Выполнена', value: 'COMPLETE'},
            {text: 'Подтверждена', value: 'CONFIRMED'},
            {text: 'Просрочена', value: 'OVERDUE'},
            {text: 'Возможен срыв сроков', value: 'FORECAST_FAILURE'}
        ],
        render: (_, {status}) => {
            const newStatus = getCPStatus(status)
            return (
                <Tag color={'#' + newStatus[1]} style={{width: '100%', textAlign: 'center'}}>
                    {newStatus[0]}
                </Tag>
            )
        },
        onFilter: (value: any, record) => {
            return record.status === value
        }
    },
    {
        key: 'endDate',
        dataIndex: 'endDate',
        title: 'Дата выполнения',
        width: '20%',
    }
]