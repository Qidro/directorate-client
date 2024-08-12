import {ColumnsType} from "antd/es/table";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {getProjectStage} from "../../../../utils/getProjectStage";
import {Tag} from "antd";
import {Link} from "react-router-dom";

export interface ITableDataType {
    key: number;
    name: string;
    status: 'INITIATION' | 'PREPARATION' | 'REALIZATION' | 'COMPLETION' | 'POST_PROJECT_MONITORING' | 'ARCHIVED' | 'CANCELED';
}

export const columns: ColumnsType<ITableDataType> = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Наименование',
        width: '80%',
        render: (_, {name, key}) => (
            <Link to={`/project/${key}/info`}>
                {name}
            </Link>
        ),
        ...getColumnSearch('name', 'Поиск по наименованию и номеру проекта')
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: 'Стадия',
        width: '20%',
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
            return <Tag
                color={'#' + newStage[1]}
                style={{width: '100%', textAlign: 'center'}}
            >{newStage[0]}</Tag>
        }
    },
]