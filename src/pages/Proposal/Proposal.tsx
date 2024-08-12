import React, {useEffect, useMemo, useState} from 'react';
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Menu, message, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import {proposalMenu} from "../../constants/menu";
import {observer} from "mobx-react-lite";
import {checkExpert} from "../../utils/checkExpert";
import {getProposalStatus} from "../../utils/getProposalStatus";
import ProposalModal from "../../components/ProposalModal/ProposalModal";
import dayjs from "dayjs";
import {IProposalForm} from "../../types/forms";
import {BookOutlined, DownloadOutlined} from "@ant-design/icons";
import proposalApi from "../../api/proposal-api";
import {saveBlobToFile} from "../../utils/saveBlobToFile";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useStore } from '../../store';
import useMenu from "../../hooks/useMenu";
import LogsModal from "../../components/LogsModal/LogsModal";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import {checkStore} from "../../utils/checkStore";
import CardTitle from "../../components/CardTitle/CardTitle";

const { Text, Title } = Typography;

const Proposal = () => {
    const {
        user: userStore,
        proposal: proposalStore
    } = useStore()

    useDocumentTitle(proposalStore.proposal.name ? `№${proposalStore.proposal.id} ${proposalStore.proposal.name}` : 'Проектное предложение')

    const [loading, setLoading] = useState<boolean>(false)
    const status = getProposalStatus(proposalStore.proposal.status)

    const {number} = useParams();
    const navigate = useNavigate();

    const [menu, selectedMenu] = useMenu(proposalMenu)

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getProposalLogs, parseInt(number!))

    const filteredMenu = useMemo(() => {
        return menu.filter(item => {
            if (item?.key === 'comment') {
                return checkExpert(proposalStore.proposal.experts || [], userStore.user.id)
            }

            return item
        })
    }, [proposalStore, userStore, menu])

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                await proposalStore.getProposal(number!)
            } catch (e) {
                navigate('/proposals');
            }
        }
        fetchProposal().then();
    }, [proposalStore, navigate, number]);

    const onEditClose = () => proposalStore.setEditOpen(false)

    const onEditSubmit = async (values: IProposalForm) => {
        setLoading(true)

        await proposalStore.updateProposal(values)

        setLoading(false)
        proposalStore.setEditOpen(false)
    }

    const download = async () => {
        message.loading('Выгрузка файла')

        try {
            const res = await proposalApi.download(proposalStore.proposal.id)
            saveBlobToFile(res.data, `Проектное предложение. ${proposalStore.proposal.name}.docx`)
        } catch (_) {
            message.error('Ошибка выгрузки документа!')
        }

        message.destroy();
    }

    return (
        <>
            <Card>
                <CardTitle>
                    {
                        checkStore([proposalStore.proposal])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Title level={4} style={{marginBottom: 0}}>№{proposalStore.proposal.id} {proposalStore.proposal.name}</Title>
                                    <Tag color={'#' + status[1]}>{status[0]}</Tag>
                                </Space>
                                <Text type="secondary">Инициатор: {proposalStore.proposal.user.fullname}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([proposalStore.proposal])
                            ? <Space size='small'>
                                <Tooltip title="Выгрузить в Word">
                                    <Button type='dashed' icon={<DownloadOutlined/>} onClick={() => download()}></Button>
                                </Tooltip>
                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined />} onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </CardTitle>
                {
                    checkStore([proposalStore.proposal]) &&
                    <Menu style={{marginTop: 15}} selectedKeys={selectedMenu} mode="horizontal" items={filteredMenu}></Menu>
                }
            </Card>

            <div style={{marginTop: 20}}>
                <Outlet/>
            </div>

            <ProposalModal
                open={proposalStore.editOpen}
                loading={loading}
                onClose={onEditClose}
                onSubmit={onEditSubmit}
                titleText='Редактирование проектного предложения'
                submitText='Отправить на повторную проверку'
                initialValues={{
                name: proposalStore.proposal.name,
                    realization_period: proposalStore.proposal.realization_period
                        ?
                        [
                            dayjs(proposalStore.proposal.realization_period[0]),
                            dayjs(proposalStore.proposal.realization_period[1])
                        ]
                        :
                        [],
                    executors: proposalStore.proposal.executors,
                    justification: proposalStore.proposal.justification,
                    purpose: proposalStore.proposal.purpose,
                    results: proposalStore.proposal.results,
                    target_indicators: proposalStore.proposal.target_indicators,
                    planned_actions: proposalStore.proposal.planned_actions,
                    resources: proposalStore.proposal.resources,
                    contacts: proposalStore.proposal.contacts,
                }}
            />

            <LogsModal
                open={logsOpen}
                logs={logs}
                onClose={() => setLogsOpen(false)}
                onScrolledToEnd={loadLogs}
                loading={logsLoading}
            />
        </>
    );
};

export default observer(Proposal);