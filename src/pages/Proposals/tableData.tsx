import {ColumnsType} from "antd/es/table";
import {getColumnSearch} from "../../utils/getColumnSearch";
import {Descriptions, Progress, Switch, Tag, Tooltip, Typography} from "antd";
import {ISmallExpert} from "../../types/proposal";
import {getProposalStatus} from "../../utils/getProposalStatus";
import {getExpertStatus} from "../../utils/getExpertStatus";
import {getColumnDateSorter} from "../../utils/getColumnDateSorter";

const {Text} = Typography

export interface ITableDataType {
    key: string | number;
    name: string;
    fio: string;
    submission_date: string
    experts: ISmallExpert[];
    status: 'SUCCESS' | 'REJECT' | 'REVIEW' | 'EXPERTS_EVALUATE' | 'DIRECTOR_EVALUATE' | 'ARCHIVED';
}

export const getColumns = (
    fullExpertInfo: boolean,
    onExpertInfoChange: () => void
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
            title: <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20}}>
                Прогресс рассмотрения
                <Tooltip title='Показать полную информацию'>
                    <Switch size='small' onChange={() => onExpertInfoChange()} checked={fullExpertInfo}/>
                </Tooltip>
            </div>,
            render: (_, {experts}) => {
                return fullExpertInfo
                    ? getFullExpertsInfo(experts)
                    : getSmallExpertsInfo(experts)
            },
            width: '5%'
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
        <Text>{success_experts} из {experts.length}</Text>
    </div>
}

const getFullExpertsInfo = (experts: ISmallExpert[]) => {
    if (experts.length === 0) return
    return <Descriptions column={1} bordered size='small'>
        {experts.map(expert => {
            const name = expert.fullname.split(' ')
            const status = getExpertStatus(expert.verification_status)
            return <Descriptions.Item label={`${name[0]} ${name[1][0]}. ${name[2][0]}.`} key={expert.id}>
                <Tag color={'#' + status[1]} style={{width: '100%', textAlign: 'center'}}>{status[0]}</Tag>
            </Descriptions.Item>
        })}
    </Descriptions>
}