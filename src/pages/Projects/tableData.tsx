import {getColumnSearch} from "../../utils/getColumnSearch";
import {ColumnsType} from "antd/es/table";
import {Tag} from "antd";
import {getProjectStage} from "../../utils/getProjectStage";
import {IUserRole} from "../../types/role";
import {getColumnDateSorter} from "../../utils/getColumnDateSorter";

export interface ITableDataType {
    key: number;
    name: string;
    start_date: string;
    end_date: string;
    stage: 'INITIATION' | 'PREPARATION' | 'REALIZATION' | 'COMPLETION' | 'POST_PROJECT_MONITORING' | 'ARCHIVED' | 'CANCELED',
    director?: IUserRole;
    directorate_curator?: IUserRole,
    curator?: IUserRole
    my_role?: IUserRole[]
}

export const getColumns = () => {
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
            onFilter: (value, record) => {
                return record.director?.fullname.toLowerCase().includes(value.toString().toLowerCase())
            },
            render: (_, {director}) => (director ? director.fullname : 'Не назначен')
        },
        {
            key: 'directorate_curator',
            dataIndex: 'directorate_curator',
            title: 'Куратор от ИД',
            width: 300,
            ...getColumnSearch('admins', 'Поиск по куратору от ИД'),
            onFilter: (value, record) => {
                return record.directorate_curator?.fullname.toLowerCase().includes(value.toString().toLowerCase())
            },
            render: (_, {directorate_curator}) => (directorate_curator ? directorate_curator.fullname : 'Не назначен')
        },
        {
            key: 'curator',
            dataIndex: 'curator',
            title: 'Куратор',
            width: 300,
            ...getColumnSearch('curator', 'Поиск по куратору'),
            onFilter: (value, record) => {
                return record.curator?.fullname.toLowerCase().includes(value.toString().toLowerCase())
            },
            render: (_, {curator}) => curator ? curator.fullname : 'Не назначен'
        },
        {
            key: 'my_role',
            dataIndex: 'my_role',
            title: 'Моя роль',
            width: 300,
            render: (_, {my_role}) => {
                return my_role && my_role.length > 0
                    ?
                    <>
                        {my_role.map((item, index) => (
                            <div key={index}>{item.role.name}</div>
                        ))}
                    </>
                    : <></>
            }
        },
    ] as ColumnsType<ITableDataType>
}