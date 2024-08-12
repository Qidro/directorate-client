import React, {useEffect, useRef, useState} from 'react';
import style from './Proposals.module.scss'
import {Button, Card, Select, Table, Typography} from "antd";
import {getColumns, ITableDataType} from "./tableData";
import {IProposalForm} from "../../types/forms";
import {observer} from "mobx-react-lite";
import ProposalApi from "../../api/proposal-api";
import {IProposal} from "../../types/proposal";
import {useNavigate} from "react-router-dom";
import ProposalModal from "../../components/ProposalModal/ProposalModal";
import dayjs from "dayjs";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {useStore} from "../../store";
import {print} from "../../utils/print";
import {PrinterOutlined} from "@ant-design/icons";

const {Title} = Typography

const tableFilters = [
    {
        label: 'Мои предложения',
        value: 'my',
    },
    {
        label: 'Все предложения',
        value: 'all',
        rights: ['DIRECTOR-EX', 'RECTOR']
    },
    {
        label: 'Назначен экспертом',
        value: 'expert',
        rights: ['EXPERT-EX']
    },
]

const proposalsToTable = (proposals: IProposal[]): ITableDataType[] => {
    return proposals.map(item => {
        return {
            key: item.id,
            name: `№${item.id} ${item.name}`,
            fio: item.user.fullname,
            submission_date: dayjs(item.submission_date).format('DD.MM.YYYY'),
            experts: item.experts,
            status: item.status
        }
    })
}

const Proposals = () => {
    useDocumentTitle('Проектные предложения')

    const userStore = useStore(store => store.user)

    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const [proposalsLoading, setProposalsLoading] = useState<boolean>(true)
    const [createLoading, setCreateLoading] = useState<boolean>(false)

    const [filters, setFilters] = useState<{label: string, value: string}[]>([])
    const [tableData, setTableData] = useState<ITableDataType[]>([])

    const [currentFilter, setCurrentFilter] = useState<string>('my')
    const [fullExpertInfo, setFullExpertInfo] = useState<boolean>(true)

    const tableRef = useRef<HTMLDivElement>(null)
    const [isPrint, setIsPrint] = useState<boolean>(false)

    useEffect(() => {
        setFilters(
            tableFilters.filter(item =>
                item.rights
                    ? item.rights.filter(right => userStore.checkRight(right)).length !== 0
                    : item
            ).map(item => ({
                label: item.label,
                value: item.value,
            }))
        )

        setProposalsLoading(true)
        ProposalApi.getMyProposals().then(res => {
            setTableData(proposalsToTable(res.data))
        }).finally(() => setProposalsLoading(false))
    }, [userStore])

    const onFilterChangeHandler = async (value: any) => {
        setProposalsLoading(true)
        setTableData([])
        setCurrentFilter(value)

        let proposals: IProposal[] = []

        switch (value) {
            case 'my':
                proposals = (await ProposalApi.getMyProposals()).data
                break
            case 'all':
                proposals = (await ProposalApi.getAllProposals()).data
                break
            case 'expert':
                proposals = (await ProposalApi.getExpertProposals()).data
                break
        }

        setTableData(proposalsToTable(proposals))
        setProposalsLoading(false)
    }

    const modalOpenHandler = () => setIsModalOpen(prev => !prev)

    const newProposalHandler = async (data: IProposalForm) => {
        setCreateLoading(true)

        const res = await ProposalApi.createProposal(
            data.name,
            data.realization_period ? data.realization_period[0].format('YYYY-MM-DD') : '',
            data.realization_period ? data.realization_period[1].format('YYYY-MM-DD') : '',
            data.executors,
            data.justification,
            data.purpose,
            data.results,
            data.target_indicators,
            data.planned_actions,
            data.resources,
            data.contacts
        )

        if (currentFilter === 'my') {
            setTableData(prev => [...prev, ...proposalsToTable([res.data])])
        }

        setCreateLoading(false)
        modalOpenHandler()
    }

    const onProposalClickHandler = (id: string | number) => {
        navigate('/proposal/' + id + '/info')
    }

    const onExportInfoChange = () => setFullExpertInfo(prev => !prev)

    const onPrintHandler = async () => {
        setIsPrint(true)
        await print(tableRef, 'horizontal')
        setIsPrint(false)
    }

    return (
        <div className={style.proposals}>
            <Card>
                <div className={style.title}>
                    <Title level={4}>Проектные предложения</Title>

                    <div className={style.actions}>
                        <Button
                            type='dashed'
                            onClick={onPrintHandler}
                            icon={<PrinterOutlined />}
                            disabled={proposalsLoading}
                            loading={isPrint}
                        />

                        <Select options={filters} size='middle' defaultValue='my' onChange={onFilterChangeHandler} style={{marginBottom: 20}} disabled={proposalsLoading}/>

                        <Button
                            type='primary'
                            onClick={modalOpenHandler}
                        >Подать проектное предложение</Button>
                    </div>
                </div>

                <Table
                    columns={
                        ['my', 'expert'].includes(currentFilter)
                            ? getColumns(fullExpertInfo, onExportInfoChange).filter(item => item.key !== 'experts')
                            : getColumns(fullExpertInfo, onExportInfoChange)
                    }
                    ref={tableRef}
                    bordered
                    dataSource={tableData}
                    loading={proposalsLoading}
                    rootClassName={style.table}
                    scroll={{x: isPrint ? 1000 : 1500}}
                    onRow={(record: ITableDataType) => {
                        return {
                            onClick: () => onProposalClickHandler(record.key)
                        }
                    }}
                    rowClassName='tableRow'
                    pagination={!isPrint ? {showSizeChanger: true, position: ['topRight', 'bottomRight']} : false}
                />
            </Card>

            <ProposalModal open={isModalOpen} onClose={modalOpenHandler} onSubmit={newProposalHandler} loading={createLoading}/>
        </div>
    );
};

export default observer(Proposals);