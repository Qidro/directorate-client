import {ColumnsType} from "antd/es/table";
import {Button} from "antd";
import React, {ReactNode} from "react";
import {DeleteOutlined} from "@ant-design/icons";
import {getColumnDateSorter} from "../../../../utils/getColumnDateSorter";

export interface ExpertTable {
    key: number;
    fullname: string;
    status: ReactNode;
    date: string;
}

export const getColumns = (
    onDelete: (id: number) => void
) => {
    return [
        {
            title: 'ФИО',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '40%'
        },
        {
            title: 'Дата назначения',
            dataIndex: 'date_appointment',
            key: 'date_appointment',
            width: '15%',
            ...getColumnDateSorter('date_appointment')
        },
        {
            title: 'Статус проверки',
            dataIndex: 'status',
            key: 'status',
            width: '20%'
        },
        {
            title: 'Дата проверки',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnDateSorter('date')
        },
        {
            key: 'action',
            render: (_, record) => (
                <Button danger type='primary' onClick={() => onDelete(record.key)} icon={<DeleteOutlined/>} block></Button>
            ),
        }
    ] as ColumnsType<ExpertTable>;
}