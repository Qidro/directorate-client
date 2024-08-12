import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Menu, message, Modal, Row, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {getProjectStage} from "../../utils/getProjectStage";
import {projectMenu} from "../../constants/menu";
import Members from "./subpages/Members/Members";
import {BookOutlined, EditOutlined, FileOutlined} from "@ant-design/icons";
import {IProposalWithFullExperts} from "../../types/proposal";
import ProposalApi from "../../api/proposal-api";
import ProposalDescription from "../../components/ProposalDescription/ProposalDescription";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import {IProjectForm} from "../../types/forms";
import {useStore} from '../../store';
import useMenu from "../../hooks/useMenu";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import LogsModal from "../../components/LogsModal/LogsModal";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";
import CardTitle from "../../components/CardTitle/CardTitle";

const {Text, Title} = Typography;

const Project = () => {
    const {
        project: projectStore,
        user: userStore,
    } = useStore();

    useDocumentTitle(projectStore.project.name ? `№${projectStore.project.id} ${projectStore.project.name}` : 'Проект')

    const [menu, selectedMenu] = useMenu(projectMenu)

    const {projectId} = useParams();
    const navigate = useNavigate();

    const stage = getProjectStage(projectStore.project.status);

    const [proposal, setProposal] = useState<IProposalWithFullExperts>();
    const [isProposalOpen, setProposalOpen] = useState<boolean>(false);
    const [projectEditing, setProjectEditing] = useState<boolean>(false)

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getProjectLogs, parseInt(projectId!))

    useEffect(() => {
        const fetchRoles = async () => {
            await projectStore.getRoles()
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
        fetchRoles().then();
    }, [projectStore, navigate, projectId]);

    const handleCancel = () => {
        setProposalOpen(false);
        projectStore.setEditOpen(false);
    }

    const openProposal = () => {
        message.loading('Загрузка проектного предложения')
        ProposalApi.getProposal(projectStore.project.proposal_id).then((res) => {
            message.destroy();
            setProposal(res.data);
            setProposalOpen(prev => !prev)
        }).catch(() => {
            message.destroy();
            message.error('Ошибка загрузки проектного предложения!')
        })
    }

    const onProjectEditSubmit = async (values: IProjectForm) => {
        setProjectEditing(true)

        await projectStore.updateProject(values)

        message.success('Данные изменены')
        setProjectEditing(false)
        projectStore.setEditOpen(false)
    }

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <CardTitle>
                    {
                        checkStore([projectStore.project])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Title level={4}
                                           style={{marginBottom: 0}}>№{projectStore.project.id} {projectStore.project.name}</Title>
                                    <Tag color={'#' + stage[1]}>{stage[0]}</Tag>
                                </Space>
                                <Text
                                    type="secondary">Руководитель: {projectStore.project.users.find(user => user.role.slug === 'SUPERVISOR')?.fullname}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([projectStore.project])
                            ?
                            <Space size='small'>
                                {
                                    checkStore([userStore.user]) &&
                                    projectStore.editable &&
                                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                                    <Tooltip title="Редактировать проект">
                                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => {
                                            projectStore.setEditOpen(true)
                                        }}></Button>
                                    </Tooltip>
                                }

                                <Tooltip title="Проектное предложение">
                                    <Button type='dashed' icon={<FileOutlined/>}
                                            onClick={() => openProposal()}></Button>
                                </Tooltip>

                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined/>}
                                            onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </CardTitle>
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

            <Modal
                title='Проектное предложение'
                onCancel={handleCancel}
                footer={null}
                open={isProposalOpen}
            >
                <ProposalDescription proposal={proposal}/>
            </Modal>

            <ProjectModal
                open={projectStore.editOpen}
                onClose={handleCancel}
                onSubmit={onProjectEditSubmit}
                submitText='Сохранить'
                titleText='Редактирование проекта'
                loading={projectEditing}
                initialValues={{
                    name: projectStore.project.name,
                    short_name: projectStore.project.short_name,
                    priority: projectStore.project.priority,
                    type: projectStore.project.type,
                    description: projectStore.project.description,
                    formal_basis: projectStore.project.formal_basis,
                    project_justification: projectStore.project.project_justification,
                    additional_info: projectStore.project.additional_info,
                    project_goals: projectStore.project.project_goals,
                    risks: projectStore.project.risks,
                    deviations: projectStore.project.deviations,
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

export default observer(Project);