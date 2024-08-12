import {ColumnsType} from "antd/es/table";
import {getColumnSearch} from "../../utils/getColumnSearch";
import {IUserRole} from "../../types/role";
import {getColumnDateSorter} from "../../utils/getColumnDateSorter";

export interface ITableDataType {
    key: string | number,
    name: string,
    creationDate: string,
    leader?: IUserRole,
    admins?: IUserRole[]
}

export const columns: ColumnsType<ITableDataType> = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Наименование',
        width: '300px',
        ...getColumnSearch('name', 'Поиск по наименованию или номеру')
    },
    {
        key: 'creationDate',
        dataIndex: 'creationDate',
        title: 'Дата создания',
        width: '200px',
        ...getColumnDateSorter('creationDate')
    },
    {
        key: 'leader',
        dataIndex: 'leader',
        title: 'Руководитель',
        width: '200px',

        ...getColumnSearch('leader', 'Поиск по руководителю'),
        onFilter: (value, record) => {
            return record.leader?.fullname.toLowerCase().includes(value.toString().toLowerCase()) || false
        },

        render: (_, {leader}) => leader ? leader.fullname : 'Не назначен'
    },
    {
        key: 'admins',
        dataIndex: 'admins',
        title: 'Администраторы',
        width: '200px',

        ...getColumnSearch('admins', 'Поиск по администратору'),
        onFilter: (value, record) => {
            const admins = record.admins?.filter(item => (
                item.fullname.toLowerCase().includes(value.toString().toLowerCase())
            ))

            return admins ? admins.length > 0 : false
        },

        render: (_, {admins}) => {
            return admins && admins.length > 0 ? <>
                {admins.map(item => (
                    <div key={item.id}>{item.fullname}</div>
                ))}
            </> : 'Не назначены'
        }
    },
]