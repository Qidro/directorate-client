import React, {useEffect, useState} from 'react';
import {getColumns} from "./tableData";
import {message, Table} from "antd";
import {IProposal} from "../../../../../../types/proposal";
import dayjs from "dayjs";
import ProposalApi from "../../../../../../api/proposal-api";

const proposalsToTableData = (proposals: IProposal[]) => {
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

const ArchivedProposals = () => {
    const [proposals, setProposals] = useState<IProposal[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchProposals = async () => {
            setLoading(true)
            const res = await ProposalApi.getArchivedProposals()
            setProposals(res.data)
            setLoading(false)
        }

        fetchProposals().then()
    }, []);

    const onRestore = async (id: number) => {
        message.loading('Восстановление ПП');
        setLoading(true)

        try {
            await ProposalApi.restoreProposal(id)
            setProposals(prev => prev.filter(proposal => proposal.id !== id))
            message.destroy();
            message.success('ПП восстановлено!');
        } catch (_) {
            message.destroy();
            message.error('Ошибка при восстановлении ПП');
        }

        setLoading(false)
    }

    return (
        <Table
            bordered
            columns={getColumns(onRestore)}
            dataSource={proposalsToTableData(proposals)}
            loading={loading}
            pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            scroll={{x: 1500}}
        />
    );
};

export default ArchivedProposals;