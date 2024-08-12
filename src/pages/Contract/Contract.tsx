import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Col, Menu, message, Row, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import style from "../Indicator/Indicator.module.scss";
import {BookOutlined, EditOutlined, RollbackOutlined} from "@ant-design/icons";
import {contractMenu} from "../../constants/menu";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {getContractStage} from "../../utils/getContractStage";
import ContractModal from "../../components/ContractModal/ContractModal";
import {IContractForm} from "../../types/forms";
import Members from "./subpages/Members/Members";
import {useStore} from "../../store";
import useMenu from "../../hooks/useMenu";
import LogsModal from "../../components/LogsModal/LogsModal";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";

const {Title, Text} = Typography;

const Contract = () => {
    const navigate = useNavigate();
    const {projectId, contractId} = useParams();

    const [menu, selectedMenu] = useMenu(contractMenu)

    const {
        user: userStore,
        project: projectStore,
        contract: contractStore
    } = useStore()

    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [loadingEditContract, setLoadingEditContract] = useState<boolean>(false);

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getContractLogs, parseInt(contractId!))

    const stage = getContractStage(contractStore.contract.status);

    const updateContract = async (data: IContractForm) => {
        setLoadingEditContract(true);

        try {
            await contractStore.update(data)
            setEditOpen(false);
            message.success('Данные контракта изменены!');
        } catch (e) {
            message.error('Ошибка изменения данных контракта!');
        }

        setLoadingEditContract(false);
    }

    useEffect(() => {
        const fetchContract = async () => {
            try {
                await contractStore.getContract(contractId!)
            } catch (e) {
                message.error('Ошибка загрузки контракта!');
                navigate('/projects');
            }
        }

        const fetchRoles = async () => {
            try {
                await contractStore.getRoles();
            } catch (e) {
                message.error('Ошибка загрузка ролей!');
            }
        }

        const fetchProject = async () => {
            try {
                await projectStore.getProject(projectId!);
            } catch (e) {
                message.error('Ошибка загрузки проекта!');
                navigate('/projects');
            }
        }

        fetchProject().then()
        fetchContract().then()
        fetchRoles().then()
        // eslint-disable-next-line
    }, [contractStore, navigate, contractId])

    const onReturnToProject = () => {
        navigate('/project/' + projectStore.project.id + '/contracts')
    }

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <div className={style.indicator__title}>
                    {
                        checkStore([contractStore.contract])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Tooltip title='Назад к проекту'>
                                        <Button
                                            onClick={onReturnToProject}
                                            icon={<RollbackOutlined />}
                                            ></Button>
                                    </Tooltip>
                                    <Title level={4} style={{marginBottom: 0}}>{contractStore.contract.name}</Title>
                                    <Tag color={'#' + stage[1]}>{stage[0]}</Tag>
                                </Space>
                                <Text type="secondary">Ответственный: {contractStore.contract.users.find(user => user.role.slug === 'RESPONSIBLE')
                                    ? contractStore.contract.users.find(user => user.role.slug === 'RESPONSIBLE')?.fullname
                                    :'Не назначен'}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([contractStore.contract])
                            ? <Space size='small'>
                                {
                                    checkStore([contractStore.contract, projectStore.project, userStore.user]) &&
                                    projectStore.editable &&
                                    (
                                        roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                                        roleRequired(userStore.user.id, ['RESPONSIBLE'], contractStore.contract.users)
                                    ) &&
                                    <Tooltip title="Редактировать контракт">
                                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => setEditOpen(true)}></Button>
                                    </Tooltip>
                                }

                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined />} onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </div>
                <Menu style={{marginTop: 15}} selectedKeys={selectedMenu} mode="horizontal" items={menu}></Menu>
            </Card>
            <Row gutter={[20, 20]}>
                <Col lg={18} xs={24}>
                    <Outlet/>
                </Col>
                <Col lg={6} xs={24}>
                    <Members/>
                </Col>
            </Row>

            <ContractModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={updateContract}
                titleText={contractStore.contract.name}
                submitText='Сохранить'
                initialValues={{
                    name: contractStore.contract.name,
                    type: contractStore.contract.type,
                    federalLaw: contractStore.contract.federal_law,
                    plannedCost: contractStore.contract.planned_cost,
                    cost: contractStore.contract.cost,
                    paid: contractStore.contract.paid,
                    description: contractStore.contract.description,
                    link: contractStore.contract.link
                }}
                loading={loadingEditContract}
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

export default observer(Contract);