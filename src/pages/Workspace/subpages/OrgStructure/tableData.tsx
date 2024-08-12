import {Button, Popconfirm, Space, Table, TableColumnsType} from "antd";
import {Department, Position} from "../../../../types/orgStructure";
import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export const getColumns = (
    onEditDepartment: (id: number) => void,
    onDeleteDepartment: (id: number) => void
) => {
    return [
        {
            title: 'Название отдела',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearch('name', 'Поиск по отделу')
        },
        {
            title: 'Действие',
            key: 'action',
            width: '80px',
            render: (record) => (
                <Space>
                    <Button type='dashed' onClick={() => onEditDepartment(record.id)} icon={<EditOutlined/>}></Button>
                    <Popconfirm
                        title="Удаление отдела"
                        description="Вы уверены, что хотите удалить отдел?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onDeleteDepartment(record.id)}
                    >
                        <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ] as TableColumnsType<Department>
}

export const getExpandedTable = (
    record: Department,
    onEditPosition: (id: number) => void,
    onDeletePosition: (id: number) => void
) => {
    const columns: TableColumnsType<Position> = [
        {
            title: 'Название должности',
            dataIndex: 'name',
            key: 'name'
        },
        {
            key: 'action',
            width: '5%',
            render: (record) => (
                <Space>
                    <Button type='dashed' onClick={() => onEditPosition(record.id)} icon={<EditOutlined/>}></Button>
                    <Popconfirm
                        title="Удаление должности"
                        description="Вы уверены, что хотите удалить должность?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onDeletePosition(record.id)}
                    >
                        <Button danger type='primary' icon={<DeleteOutlined/>}></Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return <Table columns={columns} dataSource={record.positions} pagination={false} rowKey='id' bordered/>;
}