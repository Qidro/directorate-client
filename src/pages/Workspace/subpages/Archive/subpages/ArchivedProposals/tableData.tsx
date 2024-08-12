import {ISmallExpert} from "../../../../../../types/proposal";
import {getColumnSearch} from "../../../../../../utils/getColumnSearch";
import {getProposalStatus} from "../../../../../../utils/getProposalStatus";
import {Button, Progress, Space, Tag, Tooltip, Typography} from "antd";
import {ColumnsType} from "antd/es/table";
import {RollbackOutlined} from "@ant-design/icons";
import React from "react";
import {getColumnDateSorter} from "../../../../../../utils/getColumnDateSorter";

export interface ITableDataType {
    key: number;
    name: string;
    fio: string;
    submission_date: string
    experts: ISmallExpert[];
    status: 'SUCCESS' | 'REJECT' | 'REVIEW' | 'EXPERTS_EVALUATE' | 'DIRECTOR_EVALUATE' | 'ARCHIVED';
}

export const getColumns = (
    onRestore: (id: number) => void
) => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            width: '20%',
            ...getColumnSearch('name', 'Поиск по названию или номеру')
        },
        {
            key: 'fio',
            dataIndex: 'fio',
            title: 'ФИО инициатора',
            width: '10%',
            ...getColumnSearch('fio', 'Поиск по инициатору')
        },
        {
            key: 'date',
            dataIndex: 'submission_date',
            title: 'Дата подачи',
            width: '5%',
            ...getColumnDateSorter('submission_date')
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус',
            width: '1%',
            render: (_, {status}) => {
                const newStatus = getProposalStatus(status)
                return <Tag color={'#' + newStatus[1]}>{newStatus[0]}</Tag>
            },
            filters: [
                {text: 'Согласован', value: 'SUCCESS'},
                {text: 'Отправлен на доработку', value: 'REJECT'},
                {text: 'Подан на расмотрение', value: 'REVIEW'},
                {text: 'Рассматривается экспертами', value: 'EXPERTS_EVALUATE'},
                {text: 'Рассматривается комиссией', value: 'DIRECTOR_EVALUATE'},
            ],
            onFilter: (value: any, record) => {
                return record.status === value
            },
        },
        {
            key: 'experts',
            dataIndex: 'experts',
            title: 'Прогресс рассмотрения',
            render: (_, {experts}) => getSmallExpertsInfo(experts),
            width: '5%'
        },
        {
            key: 'action',
            width: '1%',
            render: (_, record) => (
                <Space>
                    <Tooltip title='Восстановить проектное предложение'>
                        <Button type='dashed' icon={<RollbackOutlined />} onClick={() => onRestore(record.key)}/>
                    </Tooltip>
                </Space>
            ),
        }
    ] as ColumnsType<ITableDataType>
}

const getSmallExpertsInfo = (experts: ISmallExpert[]) => {
    const success_experts = experts.reduce((sum, expert) => (
        expert.verification_status !== '' ? sum + 1 : sum
    ), 0)

    return <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Progress
            type='dashboard'
            trailColor="#FFE6E6"
            percent={(100 / experts.length) * success_experts}
            size={20}
            strokeColor='#e63636'
        />
        <Typography.Text>{success_experts} из {experts.length}</Typography.Text>
    </div>
}