import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, message, Typography} from "antd";
import ContractModal from "../../../../components/ContractModal/ContractModal";
import ResizableAntdTable from "resizable-antd-table";
import {useParams} from "react-router-dom";
import {getColumns, ITableDataType} from "./tableData";
import ContractApi from "../../../../api/contract-api";
import {IProjectContract} from "../../../../types/contract";
import {IContractForm} from "../../../../types/forms";
import {useStore} from "../../../../store";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const contractToTable = (contracts: IProjectContract[]): ITableDataType[] => {
    return contracts.map(contract => {
        return {
            key: contract.id,
            name: contract.name,
            status: contract.status,
            plannedCost: contract.planned_cost,
            cost: contract.cost,
            paid: contract.paid,
            responsibleUsers: contract.users
        }
    })
}

const Contracts = () => {
    const {projectId} = useParams();

    const {
        project: projectStore,
        user: userStore,
    } = useStore();

    const [contractModalOpen, setContractModalOpen] = useState<boolean>(false);
    const [contractsLoading, setContractsLoading] = useState<boolean>(false);
    const [addingContract, setAddingContract] = useState<boolean>(false);
    const [tableData, setTableData] = useState<ITableDataType[]>([]);

    const addContract = async (data: IContractForm) => {
        setAddingContract(true);

        try {
            const res = await ContractApi.add(
                projectStore.project.id,
                data.name,
                data.type,
                data.federalLaw,
                data.plannedCost,
                data.cost,
                data.paid,
                data.description,
                data.link
            );

            setTableData([...tableData, {
                key: res.data.id,
                name: res.data.name,
                status: res.data.status,
                plannedCost: res.data.planned_cost,
                cost: res.data.cost,
                paid: res.data.paid,
            }])

            setContractModalOpen(false);
        } catch (e) {message.error('Ошибка добавления контракта!');}

        setAddingContract(false);
    }

    const removeContract = async (contractId: number) => {
        message.loading('Удаление контракта');

        try {
            await ContractApi.delete(contractId);
            setTableData(tableData.filter(data => data.key !== contractId));
            message.destroy();
            message.success('Контракт удален!');
        } catch (e) {
            message.destroy();
            message.error('Ошибка удаления контракта!');
        }
    }

    useEffect(() => {
        const fetchContracts = async () => {
            setContractsLoading(true);

            try {
                const res = await ContractApi.getContracts(projectId!);
                setTableData(contractToTable(res.data));
            }
            catch (e) { message.error('Ошибка загрузки контрактов!'); }

            setContractsLoading(false);
        };

        fetchContracts().then();
    }, [projectId])

    return (
        <Card>
            <CardTitle block>
                <Title level={4}>Контракты</Title>
                {
                    checkStore([projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                    <Button type='primary' onClick={() => setContractModalOpen(true)}>Добавить контракт</Button>
                }
            </CardTitle>

            <ResizableAntdTable
                columns={getColumns(removeContract, projectStore.editable, projectStore.project.id,
                    checkStore([projectStore.project, userStore.user]) &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users))}
                bordered
                dataSource={tableData}
                loading={contractsLoading}
                scroll={{x: 800}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />

            <ContractModal
                open={contractModalOpen}
                onClose={() => setContractModalOpen(false)}
                loading={addingContract}
                onSubmit={addContract}
            />
        </Card>
    );
};

export default observer(Contracts);